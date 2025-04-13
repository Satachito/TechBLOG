export default class
JPTable extends HTMLElement {

	constructor( json ) {
		super()
		this.innerHTML = '<table><thead></thead><tbody></tbody></table>'

		const data = JSON.parse( json )
		const Row = ( r, t_h_d ) => '<tr>' + r.map( h_d => `<t${t_h_d}>${h_d}</t${t_h_d}>` ).join( '' ) + '</tr>'

		const table	= this.children[ 0 ]
		table.children[ 0 ].innerHTML = Row( data.head, 'h' )
		table.children[ 1 ].innerHTML = data.body.map( r => Row( r, 'd' ) ).join( '' )
	}
}

customElements.define( 'jp-table', JPTable )

