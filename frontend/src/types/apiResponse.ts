export type GeneralApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};



