/* 
 declarations.d.ts
 This file allows us to use import statement to import files with the listed extensions 
*/
declare module "*.zpt"
declare module "*.png"
declare module "*.jpg"
declare module "*.gif"
declare module "*.jpeg"
declare module "*.glb"
declare module "*.gltf"
declare module "*.ogg"
declare module "*.mp3"
declare module "*.obj"
declare module "*.fbx"
declare module "*.wav"
declare module "*.ttf"
declare module "*.fnt"
declare module "*.woff"
declare module "*.stl"
declare module "*.mp4"
declare module "*.json"
declare module "*.hdr"
declare module "*.webm"
declare module JSX{
    interface IntrinsicElements{
        "group": any,
        "geometry": any,
        "lineBasicMaterial": any,
        "mesh": any,
        "octahedronGeometry": any,
        "meshBasicMaterial": any,
        "orbitControls": any, //I added this
        "primitive": any, //I added this
        "ambientLight": any //I added this
    }
}