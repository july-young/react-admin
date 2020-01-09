import React from 'react'
import User from '../../models/user';

const { connect } = require('react-redux')


function Home() {

    return (
        <div>
            Home
        </div>
    );
}

export default connect(
    (state: { user: User; }) => ({ user: state.user }),
    {}
)(Home)