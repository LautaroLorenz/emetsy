export enum EssayErrorCodeEnum {
  name = 'name',
  AtLeastOneStep = 'AtLeastOneStep',
  PreparationRequired = 'PreparationRequired',
  PreparationOrderAfter = 'PreparationOrder',
  ReportAtEnd = 'ReportAtEnd',
}
export type EssayErrorCode = EssayErrorCodeEnum;

export const EssayErrorMessages: Record<EssayErrorCode, { code: string, message: string }> = {
  [EssayErrorCodeEnum.name]: { code: 'Nombre', message: 'Debes ingresar un nombre de ensayo' },
  [EssayErrorCodeEnum.AtLeastOneStep]: { code: 'Requerido', message: 'El ensayo debe contener al menos un paso' },
  [EssayErrorCodeEnum.PreparationRequired]: { code: 'Falta preparación', message: 'Este ensayo necesita un paso de preparación' },
  [EssayErrorCodeEnum.PreparationOrderAfter]: { code: 'Preparación orden anterior', message: 'Hay un paso que requiere un paso de preparación anterior' },
  [EssayErrorCodeEnum.ReportAtEnd]: { code: 'Finalizar con reporte', message: 'El reporte debe ocurrir al final' },
}