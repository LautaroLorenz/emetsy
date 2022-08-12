export enum EssayErrorCodeEnum {
  name = 'name',
  AtLeastOneStep = 'AtLeastOneStep',
}
export type EssayErrorCode = EssayErrorCodeEnum;

export const EssayErrorMessages: Record<EssayErrorCode, { code: string, message: string }> = {
  [EssayErrorCodeEnum.name]: { code: 'Nombre', message: 'Debes ingresar un nombre de ensayo' },
  [EssayErrorCodeEnum.AtLeastOneStep]: { code: 'Requerido', message: 'El ensayo debe contener al menos un paso' },
}