import vector3 from "./vector3";

export default interface ARObject {
    type: string,
    value: string,
    position: vector3,
    rotation: vector3
}