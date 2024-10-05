mergeInto(LibraryManager.library, {
    $device: null,
    $context: null,

    $loadRNBOScript: function(version) {
        return new Promise((resolve, reject) => {
            var el = document.createElement("script");
            el.src = "./Build/RNBO/rnbo.min.js";
            el.onload = resolve;
            el.onerror = reject;
            document.body.appendChild(el);
        });
    },

    initializeRNBO__deps: ['$device', '$context', '$loadRNBOScript'],
    initializeRNBO: async function() {
        var patchExportURL = "./Build/RNBO/patch.export.json";
        
        var WAContext = window.AudioContext || window.webkitAudioContext;
        context = new WAContext();

        var outputNode = context.createGain();
        outputNode.connect(context.destination);

        try {
            var response = await fetch(patchExportURL);
            var patcher = await response.json();

            await loadRNBOScript(patcher.desc.meta.rnboversion);

            device = await RNBO.createDevice({ context: context, patcher: patcher });

            var dependenciesResponse = await fetch("./Build/RNBO/dependencies.json");
            var dependencies = await dependenciesResponse.json();
            if (dependencies.length) {
                await device.loadDataBufferDependencies(dependencies);
            }

            device.node.connect(outputNode);

            if (context.state === 'suspended') {
                var resumeAudio = function() {
                    context.resume();
                    console.log("AudioContext resumed");
                    document.removeEventListener('click', resumeAudio);
                    document.removeEventListener('touchstart', resumeAudio);
                };
                document.addEventListener('click', resumeAudio);
                document.addEventListener('touchstart', resumeAudio);
            }
            console.log("RNBO initialization completed!");
        } catch (err) {
            console.error("RNBO initialization error:", err);
        }
    },

    setParameter__deps: ['$device'],
    setParameter: function(paramNamePtr, value) {
        var paramName = UTF8ToString(paramNamePtr);
        if (device) {
            console.log("Setting parameter:", paramName, "to value:", value);
            
            if (Array.isArray(device.parameters)) {
                var param = device.parameters.find(p => p.name === paramName);
                if (param) {
                    param.value = value;
                    console.log("Parameter set successfully:", paramName, value);
                } else {
                    console.error("Parameter not found:", paramName);
                }
            } else {
                console.error("Unexpected parameters structure:", device.parameters);
            }
        } else {
            console.error('RNBO device not initialized');
        }
    },

    sendMIDIMessage__deps: ['$device', '$context'],
    sendMIDIMessage: function(status, data1, data2) {
        if (device) {
            var midiPort = 0;
            var midiEvent = new RNBO.MIDIEvent(context.currentTime * 1000, midiPort, [status, data1, data2]);
            device.scheduleEvent(midiEvent);
        } else {
            console.error('RNBO device not initialized');
        }
    }
});