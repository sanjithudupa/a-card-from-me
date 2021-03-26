import { Object3D, Scene } from "three";
import vector3 from "./vector3";

export default interface ARObject {
    type: string,
    value: string,
    position: vector3,
    rotation: vector3,
    references? : {scene: Scene, controls: Object3D}
}