Highcharts.createElement('link', {
	href : '//fonts.googleapis.com/css?family=Dosis:400,600',
	rel : 'stylesheet',
	type : 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
	colors : [ "#23b7e5", "#27c24c", "#7266ba", "#fad733","#f05050" ],
	chart : {
		backgroundColor : null,
		style : {

		}
	},
	title : {
		style : {
			fontSize : '16px',
			fontWeight : 'bold',
			textTransform : 'uppercase'
		}
	},
	tooltip : {
		borderWidth : 1,
		backgroundColor : '#313030',
		shadow : false,
		borderColor: '#000',
		borderRadius : 3,
		style : {
			color : '#EFEFEF'
		}
	},
	legend : {
		itemStyle : {
			fontSize : '10px',
			color : '#98a6ad'
		},
		borderWidth : 0,
		layout : 'vertical',
		floating : true,
		align : 'right',
		verticalAlign : 'top'
	},
	xAxis : {
		gridLineWidth : 1,
		gridLineColor : '#F4F4F5',
		labels : {
			style : {
				color : '#98a6ad',
				fontSize : '11px'
			}
		},
		lineWidth : 0,
		tickWidth : 0
	},
	yAxis : {
		gridLineWidth : 1,
		gridLineColor : '#F4F4F5',
		labels : {
			style : {
				color : '#98a6ad',
				fontSize : '11px'
			}
		}
	},
	plotOptions : {
		candlestick : {
			lineColor : '#404048'
		},
		series : {
			borderWidth : 2,
			borderColor : '#23b7e5',
			marker: {
				symbol: 'circle'
			}
		},
		bar : {
			shadow : false
		},
		funnel: {
			borderWidth: 0
		},
		line: {
			marker: {
				fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null, // inherit from series
                radius: 3
			}
		},
		spline: {
			marker: {
				fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null, // inherit from series
                radius: 3
			}
		},
		area: {
			marker: {
				fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null, // inherit from series
                radius: 3
			}
		},
		areaspline: {
			marker: {
				lineWidth: 1,
                lineColor: null, // inherit from series
                radius: 2
			}
		}

	},

	// General
	background2 : '#F0F0EA'

};
Highcharts.setOptions(Highcharts.theme);