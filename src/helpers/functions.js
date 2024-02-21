import { PictureAsPdf as PdfIcon, Image as ImageIcon } from '@mui/icons-material';

export function detectarPalabraEnHostname(palabra) {
  // Obtiene el hostname de la URL actual
  const hostname = window.location.hostname;

  // Verifica si la palabra está presente en el hostname
  const palabraPresente = hostname.includes(palabra);

  // Devuelve true si la palabra está presente, false si no lo está
  return palabraPresente;
}

export const formatFechaLaravel = (fechaLaravel)=>{
    // Crea un objeto Date a partir de la cadena de fecha
  var fecha = new Date(fechaLaravel);

  // Obtiene el día, mes y año
  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
  var anio = fecha.getFullYear();

  // Formatea la fecha en el formato dd/mm/yyyy
  var fechaFormateada = dia + '/' + mes + '/' + anio;

  return fechaFormateada;
}

export const getImagePreviewURL = (file) => {
  if (file) {
    if (file.extension === 'pdf') {
      return {
        url: URL.createObjectURL(file),
        icon: <PdfIcon />,
      };
    } else if (file.extension === 'jpg' || file.extension === 'jpeg' || file.extension === 'png') {
      return {
        url: URL.createObjectURL(file),
        icon: <ImageIcon />,
      };
    } else {
      return null; // Handle other file types here
    }
  }
  return null;
};

export const getImagePreview = (image) => {
    if (image) {
        return URL.createObjectURL(image);
    }
    return null;
};


export const obtenerUltimoSegmento=(cadena)=>{
    const segmentos         =   cadena.split('/');
    const ultimoSegmento    =   segmentos[segmentos.length - 1];
    return ultimoSegmento;
}

export function groupItemsByInitialLetter(response,keys) {
  const groupedItems = {};

  response.data.forEach((item) => {

    let initialLetter ;

    if(item.name){
      initialLetter = item.name.charAt(0).toUpperCase();
    }

    if(item[keys]){
      initialLetter = item[keys].charAt(0).toUpperCase();
    }
    
    if (!groupedItems[initialLetter]) {
      groupedItems[initialLetter] = [];
    }
    groupedItems[initialLetter].push(item);
  });

  // Obtener las letras iniciales como un array y ordenarlas
  const initialLetters = Object.keys(groupedItems).sort();

  // Crear un nuevo objeto para almacenar los elementos agrupados en orden alfabético
  const groupedItemsAlphabetical = {};

  // Recorrer el array ordenado y copiar los elementos
  initialLetters.forEach((letter) => {
    groupedItemsAlphabetical[letter] = groupedItems[letter];
  });


  return groupedItemsAlphabetical;
}

export const formatearMontoEnCOP=(monto)=>{
    if(monto){
      // Configura las opciones de formato
      const opcionesDeFormato = {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2, // Mínimo de 2 decimales
        maximumFractionDigits: 2, // Máximo de 2 decimales
      };
    
      // Formatea el monto utilizando las opciones de formato
      return monto.toLocaleString("es-CO", opcionesDeFormato);
    }else{
      return monto;
    }
    
  }
  
  
export const limitarCadena=(cadena, maxLength)=> {
  if (cadena.length > maxLength) {
    return cadena.slice(0, maxLength); // Recorta la cadena a la longitud máxima
  }  
}

export  function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        return 'Invalid input';
    }

    // Opciones para formatear el número
    const options = {
        style: 'currency',
        currency: 'COP', // Código de moneda para pesos colombianos
        minimumFractionDigits: 2, // Mínimo 2 decimales
    };

    // Formatear el número y devolverlo como cadena
    return amount.toLocaleString('es-CO', options);
}

export  function formatNumber(amount) {
    if (typeof amount !== 'number') {
        return 'Invalid input';
    }

    // Opciones para formatear el número
    const options = {
        style: 'unit',
        unit: 'kilogram',
    };

    // Formatear el número y devolverlo como cadena
    return amount.toLocaleString('es-CO', options);
}

  