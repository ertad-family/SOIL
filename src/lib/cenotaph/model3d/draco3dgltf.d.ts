/**
 * Type declarations for draco3dgltf
 * This package provides Draco compression for glTF models
 */
declare module "draco3dgltf" {
  interface DecoderModule {
    // Draco decoder module interface
  }

  interface EncoderModule {
    // Draco encoder module interface
  }

  export function createDecoderModule(): Promise<DecoderModule>;
  export function createEncoderModule(): Promise<EncoderModule>;

  const draco3d: {
    createDecoderModule: typeof createDecoderModule;
    createEncoderModule: typeof createEncoderModule;
  };

  export default draco3d;
}
