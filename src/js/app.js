import Swiper from 'swiper/bundle';
import * as noUiSlider from 'nouislider';

function isWebp() {

    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {
        let className = support === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
}
isWebp();

// const menuBody = document.querySelector('.bottom-header');
// const iconMenu = document.querySelector('.top-header__burger');
// if (iconMenu) {
//     iconMenu.addEventListener("click", function (e) {
//         document.body.classList.toggle('_lock');
//         iconMenu.classList.toggle('_active');
//         menuBody.classList.toggle('_active');
//     });
// }

const menusBody = document.querySelectorAll('.menu-body');
const iconsMenu = document.querySelectorAll('.menu-icon');
if (iconsMenu.length > 0) {
    for (let index = 0; index < iconsMenu.length; index++) {
        const iconMenu = iconsMenu[index];
        iconMenu.addEventListener("click", function (e) {
            document.body.classList.toggle('_lock');
            iconMenu.classList.toggle('_active');
            for (let index = 0; index < menusBody.length; index++) {
                const menuBody = menusBody[index];
                menuBody.classList.toggle('_active');
            }
        });
    }


}

const likes = document.querySelectorAll('.item__favorites');
if (likes.length > 0) {
    for (let index = 0; index < likes.length; index++) {
        const like = likes[index];
        like.addEventListener("click", function (e) {
            like.classList.add('_active');
        });
    }


}

const buttonLikes = document.querySelectorAll('.item__like')
const buttonDislikes = document.querySelectorAll('.item__dislike')
const commentFields = document.querySelectorAll('.item__comment')
if (commentFields.length > 0) {
    for (let index = 0; index < buttonLikes.length; index++) {
        const commentField = commentFields[index];
        for (let index = 0; index < buttonLikes.length; index++) {
            const buttonLike = buttonLikes[index];
            buttonLike.addEventListener("click", function (e) {
                buttonLike.classList.add('_active')
                buttonLike.parentElement.classList.add('_active');
                buttonLike.nextElementSibling.classList.remove('_active')
            });
        }
        for (let index = 0; index < buttonDislikes.length; index++) {
            const buttonDislike = buttonDislikes[index];
            buttonDislike.addEventListener("click", function (e) {
                buttonDislike.parentElement.classList.add('_active');
                buttonDislike.classList.add('_active')
                buttonDislike.previousElementSibling.classList.remove('_active')
            });
        }
    }
};

// Полифилл для метода forEach для NodeList
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

document.querySelectorAll('.dropdown__content').forEach(function (dropDownWrapper) {
    const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
    const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
    const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
    const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

    // Клик по кнопке. Открыть/Закрыть select
    dropDownBtn.addEventListener('click', function (e) {
        dropDownList.classList.toggle('dropdown__list_visible');
        this.classList.toggle('dropdown__button_active');
    });

    // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
    dropDownListItems.forEach(function (listItem) {
        listItem.addEventListener('click', function (e) {
            e.stopPropagation();
            dropDownBtn.innerText = this.innerText;
            dropDownBtn.focus();
            dropDownInput.value = this.dataset.value;
            dropDownList.classList.remove('dropdown__list_visible');
            dropDownBtn.classList.remove('dropdown__button_active');
        });
    });

    // Клик снаружи дропдауна. Закрыть дропдаун
    document.addEventListener('click', function (e) {
        if (e.target !== dropDownBtn) {
            dropDownBtn.classList.remove('dropdown__button_active');
            dropDownList.classList.remove('dropdown__list_visible');
        }
    });

    // Нажатие на Tab или Escape. Закрыть дропдаун
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' || e.key === 'Escape') {
            dropDownBtn.classList.remove('dropdown__button_active');
            dropDownList.classList.remove('dropdown__list_visible');
        }
    });
});


//SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
    //получение обычных спойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });
    //инициализация спойлера
    if (spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }
    //получение спойлеров с медиа запросами
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });

    // инициализация спойлеров с медиа запросами
    if (spollersMedia.length > 0) {
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        //получение уникальных брейкпоинтов
        let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });

        //работа с каждым брейкпоинтом
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            //обьекты с нужными значениями
            const spollersArray = breakpointsArray.filter(function (item) {
                if (item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });
            //событие
            matchMedia.addListener(function () {
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        });
    }
    //инициализация
    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody) {
                    spollerTitle.removeAttribute('tabindex');
                    if (!spollerTitle.classList.contains('_active')) {
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }

    function setSpollerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
                if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 300);
            }
            e.preventDefault();
        }
    }

    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 300);
        }
    }
}

//================================================================================================

//SlideToggle 
let _slideUp = (target, duration = 300) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('mragin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}

let _slideDown = (target, duration = 300) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}

let _slideToggle = (target, duration = 300) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}

window.addEventListener("DOMContentLoaded", function () {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.classList.add('_touch');
        const panelButtons = document.querySelectorAll('.table__item');
        if (panelButtons.length > 0) {
            for (let index = 0; index < panelButtons.length; index++) {
                const panelButton = panelButtons[index];
                panelButton.addEventListener("click", function (e) {
                    panelButton.classList.toggle('_active');
                });
                // document.addEventListener('click', function (e) {
                //     if (e.target !== panelButton) {
                //         panelButton.classList.remove('_active');
                //     }
                // });
                document.addEventListener('keydown', function (e) {
                    if (e.key === 'Tab' || e.key === 'Escape') {
                        panelButton.classList.remove('_active');
                    }
                });
            }
        };




        // let dropLists = document.querySelectorAll('.arrow');
        // if (dropLists.length > 0) {
        //     for (let index = 0; index < dropLists.length; index++) {
        //         const dropList = dropLists[index];
        //         dropList.classList.add('popup-link');
        //     }
        // };

    } else {
        document.body.classList.add('_pc');


    };

    let dropLists = document.querySelectorAll('.arrow');
    if (dropLists.length > 0) {
        for (let index = 0; index < dropLists.length; index++) {
            const dropList = dropLists[index];
            dropList.addEventListener("click", function (e) {
                dropList.parentElement.classList.toggle('_active');
            });
            document.addEventListener('click', function (e) {
                if (e.target !== dropList) {
                    dropList.parentElement.classList.remove('_active');
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Tab' || e.key === 'Escape') {
                    dropList.parentElement.classList.remove('_active');
                }
            });
        }
    };




    //===================================================================================
    //POPUP'S:

    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");


    let unlock = true;

    const timeout = 500;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                const popupName = popupLink.getAttribute('href').replace('#', '');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    }

    const popupCloseIcon = document.querySelectorAll('.close-popup');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
        }
    }

    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('_lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }
            body.style.paddingRight = '0px';
            body.classList.remove('_lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        if (e.which === 27) {
            const popupActive = document.querySelector('.popup.open');
            popupClose(popupActive);
        }
    });

    const rangeSlider = document.getElementById('range-slider');
    const rengeSliderSquareValue = document.getElementById('range-slider-square-value');
    const rangeSliderFloors = document.getElementById('range-slider-floors');
    const rangeSliderCredit = document.getElementById('range-slider-credit');
    const rangeSliderPriceOnMetr = document.getElementById('range-slider-price-metr');
    const rangeSliderContribution = document.getElementById('range-slider-contribution');
    const rangeSliderKitchen = document.getElementById('range-slider-square-kitchen');
    const rangeSliderWeaving = document.getElementById('range-slider-weaving');
    if (rangeSlider) {
        noUiSlider.create(rangeSlider, {
            start: [1500000, 5000000],
            connect: true,
            step: 1,
            range: {
                'min': [1500000],
                'max': [5000000]
            }
        });

        const input0 = document.getElementById('input-0');
        const input1 = document.getElementById('input-1');
        const inputs = [input0, input1];

        rangeSlider.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSlider.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    if (rangeSliderWeaving) {
        noUiSlider.create(rangeSliderWeaving, {
            start: [5, 9],
            connect: true,
            step: 1,
            range: {
                'min': [5],
                'max': [9]
            }
        });

        const input0 = document.getElementById('input-0-weaving');
        const input1 = document.getElementById('input-1-weaving');
        const inputs = [input0, input1];

        rangeSliderWeaving.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSliderWeaving.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    if (rangeSliderKitchen) {
        noUiSlider.create(rangeSliderKitchen, {
            start: [59, 150],
            connect: true,
            step: 1,
            range: {
                'min': [59],
                'max': [150]
            }
        });

        const input0 = document.getElementById('input-0-kitchen');
        const input1 = document.getElementById('input-1-kitchen');
        const inputs = [input0, input1];

        rangeSliderKitchen.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSliderKitchen.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    let tab = function () {
        let tabNav = document.querySelectorAll('.tabs-nav'),
            tabContent = document.querySelectorAll('.tab'),
            tabName;

        tabNav.forEach(item => {
            item.addEventListener('click', selectTabNav)
        });

        function selectTabNav() {
            tabNav.forEach(item => {
                item.classList.remove('_active');
            });
            this.classList.add('_active');
            tabName = this.getAttribute('data-tab-name');
            selectTabContent(tabName);
        }

        function selectTabContent(tabName) {
            tabContent.forEach(item => {
                item.classList.contains(tabName) ? item.classList.add('_active') : item.classList.remove('_active');
            })
        }

    };

    tab();

    if (rangeSliderPriceOnMetr) {
        noUiSlider.create(rangeSliderPriceOnMetr, {
            start: [95000, 120000],
            connect: true,
            step: 1,
            range: {
                'min': [95000],
                'max': [140000]
            }
        });

        const input0 = document.getElementById('input-0-price-metr');
        const input1 = document.getElementById('input-1-price-metr');
        const inputs = [input0, input1];

        rangeSliderPriceOnMetr.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSliderPriceOnMetr.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    if (rangeSliderContribution) {
        noUiSlider.create(rangeSliderContribution, {
            start: [400000, 5000000],
            connect: true,
            step: 1,
            range: {
                'min': [200000],
                'max': [5000000]
            }
        });

        const input0 = document.getElementById('input-0-contribution');
        const input1 = document.getElementById('input-1-contribution');
        const inputs = [input0, input1];

        rangeSliderContribution.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSliderContribution.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    if (rengeSliderSquareValue) {
        noUiSlider.create(rengeSliderSquareValue, {
            start: [59, 250],
            connect: true,
            step: 1,
            range: {
                'min': [59],
                'max': [250]
            }
        });

        const input0 = document.getElementById('input-0-square');
        const input1 = document.getElementById('input-1-square');
        const inputs = [input0, input1];

        rengeSliderSquareValue.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rengeSliderSquareValue.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    if (rangeSliderFloors) {
        noUiSlider.create(rangeSliderFloors, {
            start: [1, 100],
            connect: true,
            step: 1,
            range: {
                'min': [1],
                'max': [100]
            }
        });

        const input0 = document.getElementById('input-0-floors');
        const input1 = document.getElementById('input-1-floors');
        const inputs = [input0, input1];

        rangeSliderFloors.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSliderFloors.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    if (rangeSliderCredit) {
        noUiSlider.create(rangeSliderCredit, {
            start: [1, 100],
            connect: true,
            step: 1,
            range: {
                'min': [1],
                'max': [100]
            }
        });

        const input0 = document.getElementById('input-0-credit');
        const input1 = document.getElementById('input-1-credit');
        const inputs = [input0, input1];

        rangeSliderCredit.noUiSlider.on('update', function (values, handle) {
            inputs[handle].value = Math.round(values[handle]);
        });

        const setRangeSlider = (i, value) => {
            let arr = [null, null];
            arr[i] = value;

            console.log(arr);

            rangeSliderCredit.noUiSlider.set(arr);
        };

        inputs.forEach((el, index) => {
            el.addEventListener('change', (e) => {
                console.log(index);
                setRangeSlider(index, e.currentTarget.value);
            });
        });
    }

    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

    const itemSlider = new Swiper('.item__slider', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.item__button-next-01',
            prevEl: '.item__button-prev-01',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 30,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
            },
            492: {
                spaceBetween: 20,
            },
            767: {
                spaceBetween: 30,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const itemSlider02 = new Swiper('.item__slider-02', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.item__button-next-02',
            prevEl: '.item__button-prev-02',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 30,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
            },
            492: {
                spaceBetween: 20,
            },
            767: {
                spaceBetween: 30,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const itemSlider03 = new Swiper('.item__slider-03', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.item__button-next-03',
            prevEl: '.item__button-prev-03',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 30,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
            },
            492: {
                spaceBetween: 20,
            },
            767: {
                spaceBetween: 30,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const itemSlider04 = new Swiper('.item__slider-04', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.item__button-next-04',
            prevEl: '.item__button-prev-04',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 30,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
            },
            492: {
                spaceBetween: 20,
            },
            767: {
                spaceBetween: 30,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const itemSlider05 = new Swiper('.item__slider-05', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.item__button-next-05',
            prevEl: '.item__button-prev-05',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 30,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
            },
            492: {
                spaceBetween: 20,
            },
            767: {
                spaceBetween: 30,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const itemSlider06 = new Swiper('.item__slider-06', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.item__button-next-06',
            prevEl: '.item__button-prev-06',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 30,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
            },
            492: {
                spaceBetween: 20,
            },
            767: {
                spaceBetween: 30,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const newBuildings = new Swiper('.new-buildings__slider', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.new-buildings__slider-button-next',
            prevEl: '.new-buildings__slider-button-prev ',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 3, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 20,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
                slidesPerView: 'auto',
            },
            492: {
                slidesPerView: 'auto',
            },
            767: {
                spaceBetween: 20,
                slidesPerView: 'auto',
            },
            1023: {
                slidesPerView: 3,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const stocks = new Swiper('.stocks__slider', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.stocks__slider-button-next',
            prevEl: '.stocks__slider-button-prev ',
        },

        // pagination: {

        //     el: '.swiper-pagination_intro',

        //     type: 'bullets',

        //     clickable: true,
        // },
        //авто высота:
        autoHeight: true,
        //кол-во слайдов для показа:

        slidesPerView: 2, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 20,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,
                slidesPerView: 'auto',
            },
            492: {
                slidesPerView: 'auto',
            },
            767: {
                spaceBetween: 20,
                slidesPerView: 'auto',
            },
            1023: {
                slidesPerView: 2,
            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        // thumbs: {
        //     //настройки миниатюрного слайдера:
        //     swiper: {
        //         el: '.image-mini-slider',
        //         slidesPerView: 5,
        //     }
        // }

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });
    const broadcast = new Swiper('.broadcast__slider', {
        loop: true,
        speed: 800,
        slidesPerView: 1.1,
        spaceBetween: 0,
        initialSlide: 1,
        centeredSlides: true,
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 6,
            modifier: 120,
        },
        grabCursor: true,
        parallax: true,
        navigation: {
            nextEl: '.broadcast__slider-button-next',
            prevEl: '.broadcast__slider-button-prev',
        },
        breakpoints: {
            1000: {
                slidesPerView: 2,
                spaceBetween: 0
            },
            767: {
                slidesPerView: 2,
                spaceBetween: -80

            },
        }

    });
    const objectInfo = new Swiper('.object-info__slider', {

        //включение / отключение
        //перетаскивания на пк:
        sumulateTouch: false, //or false
        // чувствительность свайпа:
        touchRatio: 1,
        //угол срабатывания свайпа/перетаскивания:
        touchAngel: 45,
        //Курсор перетаскивания:
        grabCursor: false, //or false
        //переключение при клике на слайд:
        slideToClickedSlide: false, //or false
        //навигация по хешу, у каждого слайда будет свой адрес:
        hashNavigation: {
            //отслеживать состояние
            watchState: false, // or false
        },
        //управление клавой:
        keyboard: {
            //вкл / выкл:
            enabled: true,
            //вкл / выкл, только когда слайдер
            //в пределах вьюпорта
            onlyInViewport: true,
            //вкл / выкл, управление клавишами
            // pageUp, pageDown:
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.object-info__slider-button-next',
            prevEl: '.object-info__slider-button-prev ',
        },


        pagination: {

            el: '.object-info__fraction',

            type: 'fraction',
        },
        //авто высота:
        autoHeight: false,
        //кол-во слайдов для показа:

        slidesPerView: 1, //можно указать auto, для корректной работы в css указать для слайдов width: auto;, ,будет подстравиваться под контент слайдов.
        //отключение функционала 
        //если слайдов меньше чем нужно
        watchoverflow: false,
        //отступы между слайдами:
        spaceBetween: 20,
        //кол-во пролистываемых слайдов:
        slidesPerGroup: 1,
        //активный слайд по центру:
        centeredSlides: false,
        //стартовый слайд:
        // initialSlide: 2,//,1,2 и тп,
        //мультирядность:
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        //бесконечный слайдер:
        loop: false, // or false - не работает с мультирядностью
        //кол-во дублирующих слайдов:
        loopedSlides: 0, // работает с loop
        //свободный режим - крутая тема (слайдер будет останавливаться в свободном месте)
        freeMode: false,
        //авто прокрутка :
        // autoplay: {
        //     //пауза между прокруткой
        //     delay: 5000,
        //     //закончить на последнем слайде
        //     stopOnLastSlide: false,
        //     //отключить после ручного переключения
        //     disableOnInteraction: false,
        // },
        //скорость переключения слайдов:
        speed: 900,
        //вертикальный сладер
        //для корректной работы нужно установить высоту всего слайдера
        // direction: 'vertical',
        direction: 'horizontal',
        //Эффекты переключения слайдов
        //листание
        effect: 'slide',

        //Эффекты переключения слайдов
        // смена прозрачности
        // effect: 'fade',

        // // дополнение к fade:
        // fadeEffect: {
        //     //параллельная смена прозрачности:
        //     crossFade: true
        // },

        //Эффекты переключения слайдов
        //переворот
        // effect: 'flip',

        // // дополнение к flip
        // flipEffect: {
        //     //тень
        //     slideShadows: true,
        //     //показ только активного слайда:
        //     limitRotation: true,
        // },

        //Эффекты переключения слайдов
        //куб
        // effect: 'cube',

        // //дополнение к cube
        // cudeEffects: {
        //     ///настройка тени
        //     slideShadows: true,
        //     shadow: true,
        //     shadowOffset: 20,
        //     shadowScale: 0.94,
        //     //для использования в css стоит ограничить ширину слайдера
        // },

        //Эффекты переключения слайдов
        //эффект потока
        // effect: 'coverflow',

        // // дополнение к coverflow:
        // coverflowEffect: {
        //     //угол
        //     rotate: 20,
        //     //наложение
        //     strecth: 50,
        //     //тень
        //     slideShadows: false,
        // },

        //АДАПТИВ СЛАЙДЕРА:

        //брейк поинты (адаптив)
        //ширина экрана
        breakpoints: {
            100: {
                spaceBetween: 10,

            },
            492: {

            },
            767: {
                spaceBetween: 20,

            },
            1023: {

            }
        },

        //LAZY LOADING:
        //для картинок в html добавить 1x1 пиксельное изображение в атрибут src,
        //а в атрибут data-src="путь к картинке" и добавить картинке класс swiper-lazy
        //также после картинки добавить div с классом swiper-lazy-preloader - который вывидет анимационную иконку подгрузки

        //отключить предзагрузку картинок
        preloadImages: false,
        // настройки подгрузки картинок:
        lazy: {
            //подгружать на старте
            //перекл слайда
            loadOntransitionStart: false,
            //подгрузить предидущую и слдеующую картинку
            loadPrevNext: false,
        },
        //слежка за видимыми слайдами
        watchSlidesProgress: true,
        //добавление класса видимым слайдам
        watchSlidesVisibility: true,
        //возможность увеличивания картинок: для этого в html оболочке картинки добавить класс (swiper-zoom-container)

        //зум картнки при двойном клике:
        zoom: {
            //макс увел:
            maxRatio: 1,
            //мин увел
            minRatio: 1,
        },

        //превью, миниатюры для главного слайдера - для этого в html нужно создать еще один слайдер с тем же кол-вом слайдов и настроить стили для него:
        thumbs: {
            //настройки миниатюрного слайдера:
            swiper: {
                el: '.thumbs__slider',
                slidesPerView: 2,
                spaceBetween: 10,
                direction: 'horizontal',
                breakpoints: {
                    100: {
                        direction: 'horizontal',
                        spaceBetween: 10,

                    },
                    // 1200: {
                    //     direction: 'vertical'
                    // },

                    1210: {
                        direction: 'vertical'
                    }
                },
            },

        },

        //исправление багов слайдера:

        //обновление слайдера при его изменении:
        observer: true,

        //обновить при изменении родительских элементов слайдера:
        observeParents: true,

        //обновить при изменении дочерних эл-тов слайда:
        observeSlideChildren: true,

        //паралакс эффект:
        // parallax: true,

    });


    const mapScroll = new Swiper(".map-catalog__content-body", {
        direction: "horizontal",
        slidesPerView: "auto",
        freeMode: true,
        scrollbar: {
            el: ".map-catalog__scroll",
        },
        mousewheel: true,
        breakpoints: {
            320: {
                direction: "horizontal",
            },
            // 767: {
            //     direction: "vertical",
            // }
        }
    });

    ymaps.ready(function () {
        var myMap = new ymaps.Map('location-map', {
                center: [55.751574, 37.573856],
                zoom: 9
            }, {
                searchControlProvider: 'yandex#search'
            }),

            // Создаём макет содержимого.
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
            ),

            myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: 'Собственный значок метки',
                balloonContent: 'Это красивая метка'
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: 'images/myIcon.gif',
                // Размеры метки.
                iconImageSize: [30, 42],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-5, -38]
            }),

            myPlacemarkWithContent = new ymaps.Placemark([55.661574, 37.573856], {
                hintContent: 'Собственный значок метки с контентом',
                balloonContent: 'А эта — новогодняя',
                iconContent: '12'
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#imageWithContent',
                // Своё изображение иконки метки.
                iconImageHref: 'images/ball.png',
                // Размеры метки.
                iconImageSize: [48, 48],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-24, -24],
                // Смещение слоя с содержимым относительно слоя с картинкой.
                iconContentOffset: [15, 15],
                // Макет содержимого.
                iconContentLayout: MyIconContentLayout
            });

        myMap.geoObjects
            .add(myPlacemark)
            .add(myPlacemarkWithContent);
    });

    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: [55.751574, 37.573856],
                zoom: 9
            }, {
                searchControlProvider: 'yandex#search'
            }),

            // Создаём макет содержимого.
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
            ),

            myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: 'Собственный значок метки',
                balloonContent: 'Это красивая метка'
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: 'images/myIcon.gif',
                // Размеры метки.
                iconImageSize: [30, 42],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-5, -38]
            }),

            myPlacemarkWithContent = new ymaps.Placemark([55.661574, 37.573856], {
                hintContent: 'Собственный значок метки с контентом',
                balloonContent: 'А эта — новогодняя',
                iconContent: '12'
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#imageWithContent',
                // Своё изображение иконки метки.
                iconImageHref: 'images/ball.png',
                // Размеры метки.
                iconImageSize: [48, 48],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-24, -24],
                // Смещение слоя с содержимым относительно слоя с картинкой.
                iconContentOffset: [15, 15],
                // Макет содержимого.
                iconContentLayout: MyIconContentLayout
            });

        myMap.geoObjects
            .add(myPlacemark)
            .add(myPlacemarkWithContent);
    });
});