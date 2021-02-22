/*!
 **********************************************************************
 
 **********************************************************************
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../evampsaanga_appConfigurations/configuration';
import image404 from '../evampsaanga_media/images/image404.png';

const Page404 = () => {
    return (
        <div className="page-404 d-flex flex-column align-items-center justify-content-center">
            <div className="pageContent d-flex flex-column">
                <img src={image404} alt="Page not found" />
                <Link to={BASE_URL} className="btn btn-secondary btn-round btn-wide mt-5">Back to Home</Link>
            </div>
        </div>
    );
}

export default Page404;