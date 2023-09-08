import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Se genera una funcion exportable para mosrtar alertas

export function show_alert(message, icon, focus_element){
    onfocus(focus_element);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: message,
        icon: icon
    });
}

// Generamos una funcion de foco para los inputs

function onfocus(focus_element){
    if (focus_element !== '') {
        document.getElementById(focus_element).focus();
    }
}