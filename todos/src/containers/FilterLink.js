import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
  estado: ownProps.filtro === state.visibilityFilter,
});

//En este caso queremos que en props haya un método llamado onClick
//El metodo hara un dispatch de un action creator, esto es, afectará al estado en redux
const mapDispatchToProps = (dispatch, ownProps) => ({
  enClick: () => dispatch(setVisibilityFilter(ownProps.filtro)),
});

//Establece una conexión entre el componente y redux
export default connect(
  //Recupera del estado las props que nuestro componente necesita
  mapStateToProps,
  //Se ejecuta al una vez al crear el componente. Contendra todos los metodos que necesitamos en props para gestionar el estado. Recibimos como argumento una funcion dispatch utilizara 
  mapDispatchToProps
)(Link)
//Link es el componente que estamos vinculando a Redux