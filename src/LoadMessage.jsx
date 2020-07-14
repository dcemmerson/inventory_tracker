import React from 'react';

export function LoadMessage(props) {

    return (
        <div className="container">
            <div className="row">
                <div className="col my-5">
                    <span className="loadingMessage">
                    <span className="spinner-border spinner-md text-secondary mx-2 "></span>
                        Loading inventory from database...
                    </span>
                </div>
            </div>
        </div>
    );
}