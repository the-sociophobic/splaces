declare module "*.vert" {
  const value: any
  
  export default value
}

declare module "*.frag" {
  const value: any
  
  export default value
}

declare module "*?raw"
{
    const content: string;
    export default content;
}
