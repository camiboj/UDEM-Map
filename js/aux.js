function resetBindings(FMap) {
    const self = FMap;
    $('.toggle').off('click').on('click', function () {
        let [, id] = $(this).attr('id').split('-');
        if (self.network.isCluster('cluster-' + id)) {
            self.network.openCluster('cluster-' + id);
            let color = self.network.groups.groups[id].color
            $(this).css("background-color", color);
        }
        else {
            self.network.cluster({
                joinCondition: function (nodeOptions) { return nodeOptions.categoria === id; },
                clusterNodeProperties: {id: 'cluster-' + id, hidden: true, level: 20, allowSingleNodeCluster: true}
            })
            $(this).css("background-color", "");
        }
        self.network.fit()
    });

    self.network.off('click').on("click", function (params) {
        if (!params.event.isFinal) return;
        let id = params.nodes[0];
        if (!id) {
            $(".close-button").click();
            return;
        }
        if (!self.materias.get(id).aprobada || self.materias.get(id).nota == -1) {
            self.aprobar(id, 0, self.cuatri)
            $(".close-button").click();
            self.materias.get(id).mostrarOpciones()
        } else {
            self.desaprobar(id)
            $(".close-button").click();
        }
        self.chequearNodosCRED()
    });
}

function breakWords(string) {
    let broken = '';
    string.split(' ').forEach(element => {
        if (element.length < 5) broken += ' ' + element;
        else broken += '\n' + element;
    });
    return broken.trim();
}

function materiasAprobadasConNota(aprobadasTotal, cuatriActual) {
    let aprobadas = new Map()
    let maxCuatri = -1
    aprobadasTotal.forEach((map, cuatri) => {
        if (cuatri > cuatriActual) return
        map.forEach((nota, materia) => {
            if (nota <= 0) return;
            if (aprobadas.has(materia)) {
                if (cuatri > maxCuatri) {
                    aprobadas.set(materia, nota)
                    maxCuatri = cuatri
                }
            }
            else
                aprobadas.set(materia, nota)
        })
    })
    return aprobadas
}

function materiasAprobadas(aprobadasTotal, cuatriActual) {
    let aprobadas = []
    aprobadasTotal.forEach((map, cuatri) => {
        if (cuatri > cuatriActual) return
        map.forEach((nota, materia) => {
            if (nota == -1) return;
            if (aprobadas.includes(materia)) return;
            aprobadas.push(materia)
        })
    })
    return aprobadas
}

function crearNetwork(nodes, edges) {
    let data = {nodes: nodes, edges: edges};
    let options = {
        nodes: {shape: 'box'},
        layout: {hierarchical: {enabled: true, direction: 'LR', levelSeparation: 150}},
        edges: {arrows: {to: {enabled: true, scaleFactor: 0.7, type: 'arrow'}}},
        groups: {
            'Aprobadas': {color: '#1dd1a1'},
            'CBC': {color: '#ff9f43'},
            'Habilitadas': {color: '#ff9f43'},
            'En Final': {color: '#feca57'},
            'Materias Obligatorias': {color: '#54a0ff'},
            'Materias Electivas': {color: '#a29bfe'},
            // Informática
            'Orientación: Gestión Industrial de Sistemas': {color: '#fab1a0'},
            'Orientación: Sistemas Distribuidos': {color: '#C4E538'},
            'Orientación: Sistemas de Producción': {color: '#fd79a8'},
            // Mecánica
            'Orientación: Diseño Mecánico': {color: '#fab1a0'},
            'Orientación: Termomecánica': {color: '#C4E538'},
            'Orientación: Metalúrgica': {color: '#fd79a8'},
            'Orientación: Computación Aplicada': {color: '#BDC581'},
            'Orientación: Industrias': {color: '#EE5A24'},
            // Electrónica
            'Orientación: Multiples Orientaciones': {color: '#fab1a0'},
            'Orientación: Procesamiento de Señales': {color: '#C4E538'},
            'Orientación: Automatización y Control': {color: '#fd79a8'},
            'Orientación: Física Electrónica': {color: '#BDC581'},
            'Orientación: Telecomunicaciones': {color: '#EE5A24'},
            'Orientación: Sistemas Digitales y Computación': {color: '#FFE4E1'},
            'Orientación: Multimedia': {color: '#FFDAB9'},
            'Orientación: Instrumentación Biomédica': {color: '#66CDAA'},
        },
    };

    return new vis.Network($('#grafo')[0], data, options);
}

function notificationSnackbar(clave) {
    let html = `
        <div id="notification">
            <p class="close-button" onclick="$(this.parentElement.parentElement).empty();"><i class="fas fa-fw fa-times"></i></p> 
            <p><strong>Datos guardados!</strong> Ya podés entrar a <a href=https://camiboj.github.io/UdeMM-Map/?clave=` + clave + `>https://camiboj.github.io/UdeMM-Map/?clave=` + clave + `</a> y ver tu progreso.</p>
        </div>
    `;
    $('#footer-snackbar-center').html($(html));    
}

function warningSnackbar(clave){
    let html = `
        <div id="alert">
            <p class="close-button" onclick="$(this.parentElement.parentElement).empty();"><i class="fas fa-fw fa-times"></i></p> 
            <p><strong>Padrón no registrado!</strong> Seleccioná tu carrera, marca las materias que aprobaste y toca el boton de guardar.
            <br>
            Una vez guardado, podés entrar a <a href=https://camiboj.github.io/UdeMM-Map/?clave=` + clave + `>https://camiboj.github.io/UdeMM-Map/?clave=` + clave + `</a> y ver tu progreso.</p>
        </div>
    `;
    $('#footer-snackbar-center').html($(html));
}

function defaultFooterSnackbar() {
    let html = `
    <div>
        <a target="_blank" href="https://github.com/camiboj/UdeMM-Map"><i class="fab fa-fw fa-github"></i></a> 
        <a><i onclick="$('#mail-content').toggle()" class="fas fa-fw fa-envelope"></i><span id="mail-content"> fdelmazo at fi.uba.ar</span></a> 
    </div>
    `;
    $('#footer-snackbar-left').html($(html));
}