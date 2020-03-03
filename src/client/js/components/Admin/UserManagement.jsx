import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import PaginationWrapper from '../PaginationWrapper';


import { createSubscribedElement } from '../UnstatedUtils';
import { toastError } from '../../util/apiNotification';

import AppContainer from '../../services/AppContainer';
import AdminUsersContainer from '../../services/AdminUsersContainer';

import PasswordResetModal from './Users/PasswordResetModal';
import InviteUserControl from './Users/InviteUserControl';
import UserTable from './Users/UserTable';

class UserManagement extends React.Component {

  constructor(props) {
    super();
    this.state = {
      statusList: new Set(),
    };
    this.handlePage = this.handlePage.bind(this);
  }

  componentWillMount() {
    this.handlePage(1);
  }

  async handlePage(selectedPage) {
    try {
      await this.props.adminUsersContainer.retrieveUsersByPagingNum(selectedPage);
    }
    catch (err) {
      toastError(err);
    }
  }


  /**
   * onChange
   */


  // To do GW-1206: setting of onChange
  onChangeStatusList(status) {
    const { statusList } = this.state;

    if (statusList.has(status)) {
      statusList.delete(status);
    }
    else {
      statusList.add(status);
    }
    this.setState({ statusList });
  }


  render() {
    const { t, adminUsersContainer } = this.props;

    const pager = (
      <div className="pull-right">
        <PaginationWrapper
          activePage={adminUsersContainer.state.activePage}
          changePage={this.handlePage}
          totalItemsCount={adminUsersContainer.state.totalUsers}
          pagingLimit={adminUsersContainer.state.pagingLimit}
        />
      </div>
    );

    return (
      <Fragment>
        {adminUsersContainer.state.userForPasswordResetModal && <PasswordResetModal />}
        <p>
          <InviteUserControl />
          <a className="btn btn-default btn-outline ml-2" href="/admin/users/external-accounts">
            <i className="icon-user-follow" aria-hidden="true"></i>
            {t('admin:user_management.external_account')}
          </a>
        </p>

        <h2>{t('User_Management')}</h2>

        <div className="row border-top border-bottom mr-2">
          <div className="px-0">

            <label className="col-md-3 mb-0 my-3">
              <i className="icon-magnifier mr-1"></i>
              <input type="text" name="name" />
            </label>
          </div>

          <div className="col-md-8 py-2 my-2" style={{ width: 600 }}>
            <input type="checkbox" className="mr-1" checked={this.state.all} onChange={() => { this.onChangeStatusList('all') }} />
          <div className="col-md-6 py-2 my-2" style={{ width: 600 }}>
            <input type="checkbox" className="mr-1" onChange={() => { this.onChangeStatusList('all') }} />
            <label className="mr-2">All</label>

            <input type="checkbox" className="mr-1" onChange={this.ApprovalPending} />
            <label className="label label-info mr-2">Approval Pending</label>

            <input type="checkbox" className="mr-1" onChange={this.Active} />
            <label className="label label-success mr-2">Active</label>

            <input type="checkbox" className="mr-1" onChange={this.Suspended} />
            <label className="label label-warning mr-2">Suspended</label>

            <input type="checkbox" className="mr-1" onChange={this.__Invited} />
            <label className="label label-info mr-2">Invited</label>
          </div>
        </div>


        {pager}
        <UserTable />
        {pager}

      </Fragment>
    );
  }

}


UserManagement.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminUsersContainer: PropTypes.instanceOf(AdminUsersContainer).isRequired,
};

const UserManagementWrapper = (props) => {
  return createSubscribedElement(UserManagement, props, [AppContainer, AdminUsersContainer]);
};

export default withTranslation()(UserManagementWrapper);
