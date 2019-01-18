/* eslint-disable no-console */
const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const plist = require('plist');

module.exports = function (context) {
    if (process.length >= 5 && process.argv[1].indexOf('cordova') == -1) {
        if (process.argv[4] != 'ios') {
            return; // plugin only meant to work for ios platform.
        }
    }

    const xcodeProjPath = fromDir('platforms/ios', '.xcodeproj', false);
    const projectPath = xcodeProjPath + '/project.pbxproj';
    if (!fs.existsSync(projectPath)) {
        console.log('XCode poject not found ' + projectPath);
        return;
    }
    const myProj = xcode.project(projectPath);
    myProj.parseSync();

    // unquote (remove trailing ")
    var projectName = myProj.getFirstTarget().firstTarget.name;
    if (projectName.charAt(0) == '"') {
        projectName = projectName.substr(1);
        projectName = projectName.substr(0, projectName.length - 1); // Removing the char " at beginning and the end.
    }

    // cordova@7 embeds the frameworks so this script is only required for cordova < 7
    if (parseInt(context.opts.cordova.version) < 7) {
        addRunpathSearchBuildProperty(myProj, 'Debug');
        addRunpathSearchBuildProperty(myProj, 'Release');

        const groupName = 'Embed Frameworks ' + context.opts.plugin.id;
        const pluginPathInPlatformIosDir = projectName + '/Plugins/' + context.opts.plugin.id;

        process.chdir('./platforms/ios');
        const frameworkFilesToEmbed = fromDir(pluginPathInPlatformIosDir, '.framework', false, true);
        process.chdir('../../');

        if (frameworkFilesToEmbed.length) {

            if (!myProj.hash.project.objects['PBXCopyFilesBuildPhase']) {
                myProj.addBuildPhase(frameworkFilesToEmbed, 'PBXCopyFilesBuildPhase', groupName, myProj.getFirstTarget().uuid, 'frameworks');
            }

            for (var frmFileFullPath of frameworkFilesToEmbed) {
                var justFrameworkFile = path.basename(frmFileFullPath);
                var fileRef = getFileRefFromName(myProj, justFrameworkFile);
                var fileId = getFileIdAndRemoveFromFrameworks(myProj, justFrameworkFile);

                // Adding PBXBuildFile for embedded frameworks
                var file = {
                    uuid: fileId,
                    basename: justFrameworkFile,
                    settings: {
                        ATTRIBUTES: ['CodeSignOnCopy', 'RemoveHeadersOnCopy'],
                    },
                    fileRef: fileRef,
                    group: groupName,
                };

                myProj.addToPbxBuildFileSection(file);

                // Adding to Frameworks as well (separate PBXBuildFile)
                var newFrameworkFileEntry = {
                    uuid: myProj.generateUuid(),
                    basename: justFrameworkFile,
                    fileRef: fileRef,
                    group: 'Frameworks',
                };

                myProj.addToPbxBuildFileSection(newFrameworkFileEntry);
                myProj.addToPbxFrameworksBuildPhase(newFrameworkFileEntry);
            }

            console.log('Embedded Frameworks in ' + context.opts.plugin.id);
        }
    }

    // The script embedded here comes from
    // http://ikennd.ac/blog/2015/02/stripping-unwanted-architectures-from-dynamic-libraries-in-xcode/
    // eslint-disable-next-line max-len
    var buildPhase = myProj.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run Script', myProj.getFirstTarget().uuid, {
        inputPaths: '',
        outputPaths: '',
        shellPath: '',
        shellScript: ''
    }).buildPhase;
    buildPhase['shellPath'] = '/bin/sh';
    // eslint-disable-next-line max-len
    buildPhase['shellScript'] = '"APP_PATH=\\"${TARGET_BUILD_DIR}/${WRAPPER_NAME}\\"\\n\\n# This script loops through the frameworks embedded in the application and\\n# removes unused architectures.\\nfind \\"$APP_PATH\\" -name \'*.framework\' -type d | while read -r FRAMEWORK\\ndo\\nFRAMEWORK_EXECUTABLE_NAME=$(defaults read \\"$FRAMEWORK/Info.plist\\" CFBundleExecutable)\\nFRAMEWORK_EXECUTABLE_PATH=\\"$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME\\"\\necho \\"Executable is $FRAMEWORK_EXECUTABLE_PATH\\"\\n\\nEXTRACTED_ARCHS=()\\n\\nfor ARCH in $ARCHS\\ndo\\necho \\"Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME\\"\\nlipo -extract \\"$ARCH\\" \\"$FRAMEWORK_EXECUTABLE_PATH\\" -o \\"$FRAMEWORK_EXECUTABLE_PATH-$ARCH\\"\\nEXTRACTED_ARCHS+=(\\"$FRAMEWORK_EXECUTABLE_PATH-$ARCH\\")\\ndone\\n\\necho \\"Merging extracted architectures: ${ARCHS}\\"\\nlipo -o \\"$FRAMEWORK_EXECUTABLE_PATH-merged\\" -create \\"${EXTRACTED_ARCHS[@]}\\"\\nrm \\"${EXTRACTED_ARCHS[@]}\\"\\n\\necho \\"Replacing original executable with thinned version\\"\\nrm \\"$FRAMEWORK_EXECUTABLE_PATH\\"\\nmv \\"$FRAMEWORK_EXECUTABLE_PATH-merged\\" \\"$FRAMEWORK_EXECUTABLE_PATH\\"\\n\\ndone"';
    buildPhase['runOnlyForDeploymentPostprocessing'] = 0;

    fs.writeFileSync(projectPath, myProj.writeSync());
    console.log('Added Arch stripping run script build phase');

    // fs.writeFileSync(projectPath, myProj.writeSync());

    /* add ${PRODUCT_BUNDLE_IDENTIFIER}.payments to URL Schemes */
    process.chdir('./platforms/ios/' + projectName);
    // var infoPlist = plist.parse(fs.readFileSync(projectName + '-Info.plist', 'utf8'));
    //
    // var found = false;
    // if (infoPlist.CFBundleURLTypes) {
    //     infoPlist.CFBundleURLTypes.forEach(function (curValue) {
    //         if (curValue.CFBundleURLSchemes) {
    //             curValue.CFBundleURLSchemes.forEach(function (curValue2) {
    //                 if (curValue2 == '${PRODUCT_BUNDLE_IDENTIFIER}.braintree.payments') {
    //                     found = true;
    //                 }
    //             });
    //         }
    //     });
    // } else {
    //     infoPlist.CFBundleURLTypes = new Array();
    // }
    //
    // if (!found) {
    //     infoPlist.CFBundleURLTypes.push({
    //         'CFBundleTypeRole': 'Editor',
    //         'CFBundleURLSchemes': ['${PRODUCT_BUNDLE_IDENTIFIER}.braintree.payments']
    //     });
    //     fs.writeFileSync(projectName + '-Info.plist', plist.build(infoPlist), {encoding: 'utf8'});
    // }

    process.chdir('../../../');
};

function fromDir(startPath, filter, rec, multiple) {
    if (!fs.existsSync(startPath)) {
        console.log('[cordova-plugin-braintree]==>no dir ', startPath);
        return;
    }

    const files = fs.readdirSync(startPath);
    var resultFiles = [];
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory() && rec) {
            fromDir(filename, filter); // recurse
        }

        if (filename.indexOf(filter) >= 0) {
            if (multiple) {
                resultFiles.push(filename);
            } else {
                return filename;
            }
        }
    }
    if (multiple) {
        return resultFiles;
    }
}

function getFileIdAndRemoveFromFrameworks(myProj, fileBasename) {
    var fileId = '';
    const pbxFrameworksBuildPhaseObjFiles = myProj.pbxFrameworksBuildPhaseObj(myProj.getFirstTarget().uuid).files;
    for (var i = 0; i < pbxFrameworksBuildPhaseObjFiles.length; i++) {
        var frameworkBuildPhaseFile = pbxFrameworksBuildPhaseObjFiles[i];
        if (frameworkBuildPhaseFile.comment && frameworkBuildPhaseFile.comment.indexOf(fileBasename) != -1) {
            fileId = frameworkBuildPhaseFile.value;
            pbxFrameworksBuildPhaseObjFiles.splice(i, 1); // MUST remove from frameworks build phase or else CodeSignOnCopy won't do anything.
            break;
        }
    }
    return fileId;
}

function getFileRefFromName(myProj, fName) {
    const fileReferences = myProj.hash.project.objects['PBXFileReference'];
    var fileRef = '';
    for (var ref in fileReferences) {
        if (ref.indexOf('_comment') == -1) {
            var tmpFileRef = fileReferences[ref];
            if (tmpFileRef.name && tmpFileRef.name.indexOf(fName) != -1) {
                fileRef = ref;
                break;
            }
        }
    }
    return fileRef;
}

function addRunpathSearchBuildProperty(proj, build) {
    const LD_RUNPATH_SEARCH_PATHS = proj.getBuildProperty('LD_RUNPATH_SEARCH_PATHS', build);
    if (!LD_RUNPATH_SEARCH_PATHS) {
        proj.addBuildProperty('LD_RUNPATH_SEARCH_PATHS', '"$(inherited) @executable_path/Frameworks"', build);
    } else if (LD_RUNPATH_SEARCH_PATHS.indexOf('@executable_path/Frameworks') == -1) {
        var newValue = LD_RUNPATH_SEARCH_PATHS.substr(0, LD_RUNPATH_SEARCH_PATHS.length - 1);
        // eslint-disable-next-line no-useless-escape
        newValue += ' @executable_path/Frameworks\"';
        proj.updateBuildProperty('LD_RUNPATH_SEARCH_PATHS', newValue, build);
    }
}
