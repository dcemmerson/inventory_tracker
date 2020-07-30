/// filename: LoadMessage.jsx
///	last modified: 07/30/2020
///	description: Stateless component that provides fallback
///		widget to display on screen while database info is being
///		loaded.

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
