import React from 'react'
import User from '../../models/user';

const { connect } = require('react-redux')


function Admin() {

    return (
        <div>
            Admin
        </div>
    );
}

export default connect(
    (state: { user: User; }) => ({ user: state.user }),
    {}
)(Admin)