/* eslint-disable @typescript-eslint/no-explicit-any */
class BackendFetching {
  decryptKey: string | undefined;
  localRequestValidator: string | undefined;
  backendApiUrl: string | undefined;

  constructor() {
    this.decryptKey = process.env.DECRYPT_KEY;
    this.localRequestValidator = process.env.LOCAL_REQUEST_VALIDATOR;
    this.backendApiUrl = process.env.NEXT_APP_LOCAL_BACKEND_API;
    // TODO: for now we dont have the production request validator
  }

  httpCallable(url: string): (configs: RequestInit) => Promise<Response> {
    return async (configs) =>
      await fetch(this.backendApiUrl + url, {
        ...configs,
        headers: {
          'Content-Type': 'application/json',
          ...configs?.headers
        }
      });
  }

  /**
   * home endpoints
   */

  async getAboutUsCards() {
    return await this.httpCallable('about-us/get-all-projects')({
      mode: 'cors',
      method: 'GET'
    });
  }
}

export default BackendFetching;
