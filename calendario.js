
/**

    * @fileoverview Calendario.

    *

    * @version                V1.0.0

    *

    * @author                 Daniel Briceño <dabl20030203@gmail.com>

    * @copyright              https://github.com/dabl03/Calendario/blob/main/LICENSE

    *

    * History

    * v1 Se creo el apis.

    * ----

    * La primera versión de calendario fue escrita por Daniel Briceño

*/
const DAY_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = [/*0: Nombre de los mese, 1 en que dia termina.*/
    ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"], //Ya no es necesario si usas el objeto array que entrego el archivo JSON festividades porque hay contiene un array con claves que contiene esta misma lista, lo dejo por si no se carga ese archivo.
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];
class calender {
    /***
     * @param {HTMLElement} ElementFather - Elemento donde se insertará todo el año.
     * @param {int} year - El año.
    */
    constructor(elementFather, year) {
        this.father = elementFather;
        this.year = year;/*Cual año es, determinará tambien si es año biciesto o nó.*/
    }
    createCalender() {
        /*Necesitamos crear el elemento table*/
        this.table = document.createElement("table");
        this.table.id = "year-" + this.year;
        this.table.setAttribute("id", "table-year")
        /*Sera nuestro titulo de todo el calendario, por lo que debe llevar la fecha.*/
        let child_caption = document.createElement("caption");
        child_caption.innerHTML = this.year;
        this.table.appendChild(child_caption);
        this.father.appendChild(this.table);
        /*Debemos crear los meses, para ello usaremos tablas y cada mes tendra un class name con su respectivo mes, anidaremos los mes en filas de 4.*/
        for (let i = 0; i < MONTHS[0].length;) {
            let tr = document.createElement("tr");
            this.table.appendChild(tr);
            for (let i_2 = 0; i_2 < 3; i++, i_2++) {//No queremos que se creen mas elemento del que debe, por lo que i se aumentará en este bucle.
                let months = document.createElement("table");
                let td = document.createElement("td");
                td.appendChild(months);//Columnas
                tr.appendChild(td);//Filas
                months.setAttribute("class", MONTHS[0][i]);
                this.createMonth(months, i);
            }
        }
    }
    /***
     * @param {tdElement} month - Elemento que representa el mes para ser rellenado con datos.
     * @param {int} i - indice para saber cual mes es.
    */
    createMonth(month, i) {
        let day_week = new Date(this.year, i, 1).getDay();
        let last_day = new Date(this.year, i + 1, 0).getDate();
        //Le damos nombre al mes:
        let element = document.createElement("caption");
        let is_resagado = 1;//No se que nombre ponerle a esta variable, determinara si hay 6 filas, si no. se le agrega una.
        element.innerHTML = MONTHS[0][i];
        month.appendChild(element);
        //Creamos una fila para los dias de la semana:
        let tr = document.createElement("tr");
        for (let week = 0; week < 7; week++) {
            let th = document.createElement("th");
            tr.appendChild(th);
            th.innerHTML = DAY_WEEK[week][0];
        }
        month.appendChild(tr);
        /*Colocamos dias anteriores al primero, si hacen falta.*/
        tr = document.createElement("tr");
        tr.innerHTML = "";
        for (let i_day = (last_day + 1) - day_week; i_day <= last_day; i_day++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = i_day;
            td.setAttribute("class", "dias-de-relleno");
        }
        month.appendChild(tr);
        /*Colocamos los demas dias.*/
        for (let i_day = 1; i_day <= last_day; i_day++, day_week++) {
            //Si terminamos la semana regresamos a domingo.
            if (day_week == 7) {
                day_week = 0;
                month.appendChild(tr = document.createElement("tr"));
                is_resagado++;
            }
            let td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = i_day;
            td.setAttribute("class", DAY_WEEK[day_week] + " day");
            td.setAttribute("id", i_day + "-of-" + MONTHS[0][i]);
        }
        /**@param Arreglar : Diciembre trae problemas con la cantidad de fila, por lo que hay que arreglarlo.*/
        /*Colocamos los ultimos dias de rellenos.*/
        let i_day = day_week;
        for (let i_day = day_week, week = 1; is_resagado < 7; is_resagado++) {
            for (; i_day < 7; week++, i_day++) {
                let td = document.createElement("td");
                tr.appendChild(td);
                td.innerHTML = week;
                td.setAttribute("class", "dias-de-relleno");
            }
            i_day = 0;
            month.appendChild(tr = document.createElement("tr"));
        }
    }
    /** Esta función se encargará de colocar todas las celebraciones.
     * @param {string[]} holidays - Array de claves y valor, que como minimo debe tener {"nombre_mes":{"dia-festivo":{"nombre-celebración","descripcion","url-imagen"}}}.
     * @param {{"name_event":function()}} event_ : [...]
    */
    appendHolidays(holidays,event_={}) {
        for (let name_month in holidays) {
            /*Mes actual*/
            for (let day in holidays[name_month]) {
                /*Dia festivo actual*/
                let td = document.getElementById(day + "-of-" + name_month);
                let article=document.createElement("article");
                let father_img=document.createElement("fieldset");
                td.innerHTML = "<b class=\"holidays\">" + day + "</b><br/>"+
                "<b class=\"name-holidays innore\">" + holidays[name_month][day]["name"] + "</b>";
                article.classList.add("holidays-desciption","innore");
                article.innerHTML="<h1><center>"+holidays[name_month][day]["name"]+"</center></h1><hr/>"+
                    "<p>"+ holidays[name_month][day]["description"] + "</p>"+
                    "<input class=\"background-img innore\" name=\"background\" value=\""+holidays[name_month][day]["background-image-url"]+"\"/><!--Esta imagen se obtiene con css para poner un fondo a toda la pagina deacuerdo con la celebración actual.-->";
                father_img.innerHTML="<legend>Imagenes sobre el año nuevo:</legend>";
                father_img.classList.add("cuadro-img")
                for (let i=0;i<holidays[name_month][day]["url-images"].length;i++){
                    let img=document.createElement("img");
                    img.setAttribute("src",holidays[name_month][day]["url-images"][i]);
                    father_img.appendChild(img);
                }
                article.style.backgroundImage="url(\""+holidays[name_month][day]["wallpaper-image-url"]+"\")";
                article.appendChild(father_img);
                td.appendChild(article);
                for (let i in event_){
                    td.addEventListener(i,event_[i],false);
                }
            }
        }
    }
}