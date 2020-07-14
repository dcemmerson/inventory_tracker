import React from 'react';

export function LoadMessage(props) {

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <span className="spinner-border text-secondary"></span>
                    <span className="loadingMessage">
                        Loading inventory from database...
                    </span>
                </div>
            </div>
        </div>
    );
}