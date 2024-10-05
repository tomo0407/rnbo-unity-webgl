# rnbo-unity-webgl
This repository is a set of scripts to call and run web applications exported by RNBO in Max8 with Unity's WebGL build application.

## File configuration
```
. 
├── RNBO                        Directory to place resources exported by RNBO
|    ├── dependencies.json      Exported from RNBO
|    ├── patch.export.json      Exported from RNBO
|    ├── patch.export.license   Exported from RNBO
|    └── rnbo.min.js            RNBO package file (not exported)
|
├── RNBOController.cs           Class to call RNBO patch from Unity
├── UnityRNBOInterface.jslib    Scripts for using JavaScript from Unity
└── README.md
```

## How to use
1. Export patches created with RNBO in Max8 to Javascript
RNBO generates the following three items.
   - dependencies.json
   - patch.export.json
   - patch.export.license
  
    Put the above three files in the RNBO directory.

2. Place the contents of this repository under Assets/Scripts in your Unity project
    ```
    Assets/Scripts
    ├── RNBO
    |    ├── dependencies.json      Your RNBOP patch
    |    ├── patch.export.json      Your RNBOP patch
    |    ├── patch.export.license   Your RNBOP patch
    |    └── rnbo.min.js            
    |
    ├── RNBOController.cs           
    ├── UnityRNBOInterface.jslib    
    └── README.md
    ```

3. Attach RNBOContoroller.cs to any GameObject in Unity
   MainCamera is recommended.
4. In the script of the Object you want to manipulate the RNBO patch, call the function in RNBOController.cs.
   For example, if you want to send parameters to the RNBO patch, do the following. Check RNBOController.cs for details.
   ```
    RNBOController.SetRNBOParameter("paramName", value);
   ```

## Notes after building to WebGL in Unity
The RNBO Patch .js file is not linked on the Unity side, so you have to place it yourself on the server to load the RNBO Patch.

If the Unity build destination is the /Exports directory, copy the contents of the aforementioned RNBO folder.
Refer to the directory structure below.
```
\Exports\Build\RNBO
            |    ├── dependencies.json      Your RNBOP patch
            |    ├── patch.export.json      Your RNBOP patch
            |    ├── patch.export.license   Your RNBOP patch
            |    └── rnbo.min.js 
            |
            ├── Exports.data.br             Unity's WebGL build object           
            ├── Exports.framework.js.br     Unity's WebGL build object 
            ├── Exports.loader.js           Unity's WebGL build object
            └── Exports.wasm.br             Unity's WebGL build object
```
If anyone knows how to link the RNBO Patch js files group at Unity build time, please let me know. I will update the script.