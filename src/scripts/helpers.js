import laptop from '../img/laptop.png';

export const fadeIn = (item, transition = 250) => {
    item.style.display = 'block';
    item.style.transition = transition + 'ms';
    item.style.opacity = '0';
    setTimeout(() => {
        item.style.opacity = '1'; 
    });
}

export const fadeOut = (item, transition = 250) => {
    item.style.transition = transition + 'ms';
    item.style.opacity = '0';
    setTimeout(() => {
        item.style.display = 'none';
    }, transition);
}

export const generateCardItem = (arr) => {
    let maxId = 0;
    
    arr.forEach((el, index, array) => {
        if (array[index].id > maxId) maxId = array[index].id;
    });

    const now = new Date();
    
    return {
        id: maxId + 1,
        img: laptop,
        heading: 'Ноутбук Apple MacBook Air 13" M1 256GB 2020 (MGND3) Gold',
        text: `${now.getHours() + ':' + now.getMinutes()} ${now.getDate() <= 8 ? '0' + ( +now.getDate() + 1 ) : now.getDate() + 1}.${now.getMonth() <= 8 ? '0' + ( +now.getMonth() + 1 ) : now.getMonth() + 1}.${now.getFullYear()}`,
        loaded: false
    }
}

