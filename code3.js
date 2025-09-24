document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карт после загрузки API
    ymaps.ready(initMaps);
    
    // Создание радиоактивных частиц
    createRadioactiveParticles();
});

function initMaps() {
    // Координаты центра для посёлка Дубовое (среднее значение всех точек)
    var dubovoeCoordinates = [50.536, 36.580];
    
    // Создаем фоновую карту
    var backgroundMap = new ymaps.Map('background-map', {
        center: dubovoeCoordinates,
        zoom: 14,
        controls: [] // Убираем все элементы управления
    }, {
        suppressMapOpenBlock: true,
        suppressObsoleteBrowserNotifier: true
    });
    
    // Отключаем взаимодействие с фоновой картой
    backgroundMap.behaviors.disable('scrollZoom');
    backgroundMap.behaviors.disable('drag');
    backgroundMap.behaviors.disable('multiTouch');
    backgroundMap.behaviors.disable('dblClickZoom');
    backgroundMap.behaviors.disable('rightMouseButtonMagnifier');
    
    // Создаем основную карту
    var mainMap = new ymaps.Map('main-map', {
        center: dubovoeCoordinates,
        zoom: 14,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });
    
    // Данные точек из вашего CSV
    var pointsData = [
        {coords: [50.53922495430032, 36.57735494348591], label: "МОУ \"Дубовская СОШ с углублённым изучением отдельных предметов\"", number: 1},
        {coords: [50.539503145110636, 36.576372230416375], label: "Стадион напротив МОУ \"Дубовская СОШ с УИОП\"", number: 2},
        {coords: [50.53927409735324, 36.57483532464949], label: "Братская могила", number: 3},
        {coords: [50.53505360603789, 36.585497105483114], label: "Парк Дуба, 2 место измерения, дуб Б. Хмельницкого", number: 8},
        {coords: [50.53680620749587, 36.584587166074456], label: "Дубовской ДК, 1 место измерения", number: 4},
        {coords: [50.537240394651455, 36.58506996369703], label: "Дубовской ДК, 2 место измерения", number: 5},
        {coords: [50.5377805588788, 36.58451206422193], label: "Дубовской ДК, 3 место измерения", number: 6},
        {coords: [50.53581431404722, 36.58446110225037], label: "Парк Дуба, 1 место измерения", number: 7},
        {coords: [50.53443648337217, 36.584456438998856], label: "Парк Дуба, 3 место измерения", number: 9},
        {coords: [50.53353258064211, 36.5834076952735], label: "Парк Дуба, 4 место измерения", number: 10},
        {coords: [50.53169138575369, 36.58205854413875], label: "Дубовской пляж", number: 11},
        {coords: [50.53568482385786, 36.5811465930736], label: "Дубовской стадион", number: 12},
        {coords: [50.53872284024423, 36.57591762659872], label: "Детская площадка №1", number: 13},
        {coords: [50.53717330133177, 36.576527829148795], label: "Детская площадка №2", number: 14},
        {coords: [50.53928862720904, 36.58106612680167], label: "Детская площадка №3", number: 15},
        {coords: [50.535289085492124, 36.577115903474755], label: "Дубовская начальная школа", number: 16.1},
        {coords: [50.536854498818684, 36.582820322110415], label: "Дубовская поликлиника", number: 17},
        {coords: [50.538869954243104, 36.57433176557413], label: "Автобусная остановка \"Дубовое\"", number: 18},
        {coords: [50.53801570768441, 36.57935956637455], label: "Автобусная остановка \"Школа\"", number: 19},
        {coords: [50.54062882231181, 36.576548611326174], label: "Автобусная остановка \"Ягодная улица, 1\"", number: 20}
    ];
    
    // Создаем кластеризатор для точек
    var clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedRedClusterIcons',
        clusterDisableClickZoom: false,
        clusterOpenBalloonOnClick: true,
        groupByCoordinates: false
    });
    
    // Создаем массив меток
    var placemarks = [];
    
    // Создаем метки для каждой точки
    pointsData.forEach(function(point) {
        var placemark = new ymaps.Placemark(point.coords, {
            balloonContentHeader: point.label,
            balloonContentBody: 'Радиационный фон: ' + point.number,
            hintContent: point.label
        }, {
            preset: 'islands#blueCircleIcon',
            iconColor: '#ff0000' // Красный цвет для лучшей видимости
        });
        
        placemarks.push(placemark);
    });
    
    // Добавляем метки в кластеризатор
    clusterer.add(placemarks);
    
    // Добавляем кластеризатор на карту
    mainMap.geoObjects.add(clusterer);
    
    // Функция синхронизации карт
    function syncMaps() {
        var mainCenter = mainMap.getCenter();
        var mainZoom = mainMap.getZoom();
        
        // Плавно синхронизируем фоновую карту
        backgroundMap.setCenter(mainCenter, mainZoom, {
            duration: 300
        });
    }
    
    // Синхронизация при изменении масштаба
    mainMap.events.add('boundschange', function(event) {
        if (event.get('newZoom') !== event.get('oldZoom') || 
            event.get('newCenter') !== event.get('oldCenter')) {
            syncMaps();
        }
    });
    
    // Синхронизация при завершении перемещения
    mainMap.events.add('actionend', function(event) {
        syncMaps();
    });
    
    // Синхронизация при изменении размера окна
    window.addEventListener('resize', function() {
        setTimeout(syncMaps, 100);
    });
    
    console.log('Карты инициализированы со всеми точками из конструктора');
    
    // Автоматически открываем баллун с первой точкой при загрузке
    setTimeout(function() {
        if (placemarks.length > 0) {
            placemarks[0].balloon.open();
        }
    }, 2000);
}

// Функция для создания радиоактивных частиц
function createRadioactiveParticles() {
    const particlesContainer = document.getElementById('radioactive-particles');
    if (!particlesContainer) {
        console.error('Контейнер для частиц не найден');
        return;
    }
    
    // Количество частиц (можно настроить)
    const particleCount = 80;
    
    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            createParticle(particlesContainer);
        }, i * 100); // Создаем частицы с задержкой для разнообразия
    }
    
    // Создаем эффект свечения радиации
    createRadiationGlow();
}

// Функция создания отдельной частицы
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'radioactive-particle';
    
    // Случайные параметры частицы
    const size = Math.random() * 6 + 2; // Размер от 2px до 8px
    const type = Math.floor(Math.random() * 3) + 1; // Тип частицы 1-3
    const duration = Math.random() * 15 + 10; // Длительность анимации от 10 до 25 секунд
    const delay = Math.random() * 5; // Задержка до 5 секунд
    const drift = (Math.random() - 0.5) * 3; // Снос в сторону от -1.5 до 1.5
    
    // Применяем стили
    particle.classList.add(`particle-type-${type}`);
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --drift: ${drift};
    `;
    
    // Добавляем анимации
    particle.style.animation = `particleFall ${duration}s linear infinite ${delay}s, 
                               particleGlow 2s ease-in-out infinite ${Math.random() * 2}s,
                               particlePulse ${Math.random() * 3 + 2}s ease-in-out infinite ${Math.random() * 2}s`;
    
    container.appendChild(particle);
    
    // Удаляем частицу после завершения анимации (для оптимизации)
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            // Создаем новую частицу для непрерывного эффекта
            createParticle(container);
        }
    }, (duration + delay) * 1000);
}

// Функция создания эффекта свечения радиации
function createRadiationGlow() {
    const glow = document.createElement('div');
    glow.className = 'radiation-glow';
    document.body.appendChild(glow);
}

// Пересоздаем частицы при изменении размера окна
window.addEventListener('resize', function() {
    const particlesContainer = document.getElementById('radioactive-particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        setTimeout(() => createRadioactiveParticles(), 100);
    }
});
