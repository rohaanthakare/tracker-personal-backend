export default class HelperService {
  static getAPIErrorMessage(error: any, defaultErrorMessage: string) {
    if (typeof error !== "string") {
      return defaultErrorMessage;
    } else {
      return error;
    }
  }
}
