import { Container } from 'unstated';

import loggerFactory from '@alias/logger';
import { pathUtils } from 'growi-commons';

import urljoin from 'url-join';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:security:AdminTwitterSecurityContainer');

/**
 * Service container for admin security page (TwitterSecurityManagement.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminTwitterSecurityContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      callbackUrl: urljoin(pathUtils.removeTrailingSlash(appContainer.config.crowi.url), '/passport/twitter/callback'),
      twitterConsumerKey: '',
      twitterConsumerSecret: '',
      isSameUsernameTreatedAsIdenticalUser: false,
    };

  }

  /**
   * retrieve security data
   */
  async retrieveSecurityData() {
    const response = await this.appContainer.apiv3.get('/security-setting/');
    const { twitterOAuth } = response.data.securityParams;
    this.setState({
      twitterConsumerKey: twitterOAuth.twitterConsumerKey || '',
      twitterConsumerSecret: twitterOAuth.twitterConsumerSecret || '',
      isSameUsernameTreatedAsIdenticalUser: twitterOAuth.isSameUsernameTreatedAsIdenticalUser || false,
    });
  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminTwitterSecurityContainer';
  }

  /**
   * Change twitterConsumerKey
   */
  changeTwitterConsumerKey(value) {
    this.setState({ twitterConsumerKey: value });
  }

  /**
   * Change twitterConsumerSecret
   */
  changeTwitterConsumerSecret(value) {
    this.setState({ twitterConsumerSecret: value });
  }

  /**
   * Switch isSameUsernameTreatedAsIdenticalUser
   */
  switchIsSameUsernameTreatedAsIdenticalUser() {
    this.setState({ isSameUsernameTreatedAsIdenticalUser: !this.state.isSameUsernameTreatedAsIdenticalUser });
  }

  /**
   * Update twitterSetting
   */
  async updateTwitterSetting() {

    const response = await this.appContainer.apiv3.put('/security-setting/twitter-oauth', {
      twitterConsumerKey: this.state.twitterConsumerKey,
      twitterConsumerSecret: this.state.twitterConsumerSecret,
      isSameUsernameTreatedAsIdenticalUser: this.state.isSameUsernameTreatedAsIdenticalUser,
    });

    this.setState({
      twitterConsumerKey: this.state.twitterConsumerKey,
      twitterConsumerSecret: this.state.twitterConsumerSecret,
      isSameUsernameTreatedAsIdenticalUser: this.state.isSameUsernameTreatedAsIdenticalUser,
    });
    return response;
  }

}
