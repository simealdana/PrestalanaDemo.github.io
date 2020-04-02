declare var require: any

var React = require('react');
var connect = require('react-redux').connect;

class FundicionLinks extends React.Component {
	render() {
		return (
			<div className="tab-page--menu col-10">
				<div id="fundicion" className="item-page--menu item-active">
					Fundición
                </div>
			</div>
		);
	}
}

export default connect(null, null)(FundicionLinks);