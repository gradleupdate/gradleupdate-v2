import pinkySwear from "pinkyswear";
import qwest from "qwest";
import parseLinkHeader from "parse-link-header";

export default class {
  constructor(token) {
    if (token) {
      this._authorization = `token ${token}`;
    }
    this._endpoint = 'https://api.github.com';
  }

  getUser() {
    return qwest.get(`${this._endpoint}/user`, null, {
      headers: {Authorization: this._authorization},
      cache: true  // prevent Cache-Control for CORS
    });
  }

  findRepository(fullName) {
    return qwest.get(`${this._endpoint}/repos/${fullName}`, null, {
      headers: {Authorization: this._authorization},
      cache: true  // prevent Cache-Control for CORS
    });
  }

  findRepositories(query = {}) {
    return qwest.get(`${this._endpoint}/user/repos`, query, {
      headers: {Authorization: this._authorization},
      cache: true  // prevent Cache-Control for CORS
    }).then((xhr, repos) =>
      this.findNextRepositories(xhr, repos)
    );
  }

  findNextRepositories(xhr, cummulative) {
    const links = parseLinkHeader(xhr.getResponseHeader('link'));
    if (links.next) {
      return qwest.get(links.next.url, null, {
        headers: {Authorization: this._authorization},
        cache: true  // prevent Cache-Control for CORS
      }).then((xhr, repos) =>
        this.findNextRepositories(xhr, cummulative.concat(repos))
      );
    } else {
      const promise = pinkySwear();
      promise(true, [xhr, cummulative]);
      return promise;
    }
  }

  findEvents(user) {
    return qwest.get(`${this._endpoint}/users/${user}/events`, null, {
      headers: {Authorization: this._authorization},
      cache: true  // prevent Cache-Control for CORS
    });
  }
}
