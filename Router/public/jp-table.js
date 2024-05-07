const
E = ( tag, text ) => {
	const $ = document.createElement( tag )
	text && ( $.textContent = text )
	return $
}

export default class
JPTable extends HTMLElement {

	constructor( data ) {
		super()
		data && this.data( data )
	}

	data( data ) {
		if ( this.sortInfo ) {
			const [ _, $ ] = this.sortInfo
			data.body.sort(
				$
				?	( p, q ) => p[ _ ] < q[ _ ] ? 1 : -1
				:	( p, q ) => p[ _ ] < q[ _ ] ? -1 : 1
			)
		}
		this.textContent = ''
		const table = this.appendChild( E( 'table' ) )
		if ( data.head ) {
			const thead = table.appendChild( E( 'thead' ) )
			thead.appendChild( E( 'tr' ) ).append(
				...data.head.map(
					( $, _ ) => {
						const th = E( 'th', $ )
						th.onclick = ev => (
							this.sortInfo = [ _, this.sortInfo ? !this.sortInfo[ 1 ] : false ]
						,	this.data( data )
						)
						this.sortInfo && this.sortInfo[ 0 ] === _ && th.setAttribute( 'sort', this.sortInfo[ 1 ] )
						return th
					}
				)
			)
		}
		const tbody = table.appendChild( E( 'tbody' ) )
	;	( data.body ? data.body : data ).forEach( _ => tbody.appendChild( E( 'tr' ) ).append( ..._.map( _ => E( 'td', _ ) ) ) )
	}

	static get observedAttributes() { return [ 'json' ] }
	attributeChangedCallback( name, oldValue, newValue ) {
		name === 'json' && this.data( JSON.parse( newValue ) )
	}
}

customElements.define( 'jp-table', JPTable )
