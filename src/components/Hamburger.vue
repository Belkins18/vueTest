<template>
    <div class="hamburger">
        <button class="navbar-toggler navbar-toggler-right hamburger__btn" type="button" data-toggle="collapse"
                data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                aria-label="Toggle navigation">
            <svg class="svg-icon hamburger__icon" viewBox="0 0 100 100" width="80">
                <path class="line svg-icon__top" d="m 30,33 h 40 c 0,0 9.044436,-0.654587 9.044436,-8.508902 0,-7.854315 -8.024349,-11.958003 -14.89975,-10.85914 -6.875401,1.098863 -13.637059,4.171617 -13.637059,16.368042 v 40" />
                <path class="line svg-icon__middle" d="m 30,50 h 40" />
                <path class="line svg-icon__bottom" d="m 30,67 h 40 c 12.796276,0 15.357889,-11.717785 15.357889,-26.851538 0,-15.133752 -4.786586,-27.274118 -16.667516,-27.274118 -11.88093,0 -18.499247,6.994427 -18.435284,17.125656 l 0.252538,40" />
            </svg>
        </button>
    </div>

</template>

<style scoped lang="scss">
    .hamburger {
        &__btn{
            position: relative;
            padding: 0rem;
            outline: none;
            width: 2.5rem;
            height: 2.5rem;
            border: none;
            &[aria-expanded="true"] {
                .svg-icon {
                    transform: rotate(45deg);

                    .svg-icon__top {
                        stroke-dashoffset: -98px;
                    }
                    .svg-icon__bottom {
                        stroke-dashoffset: -138px;
                    }
                }
            }
        }
        &__icon{}
    }

    .svg-icon {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: transform 400ms;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        height: 2.5rem;
        width: auto;
        &__top {
            stroke-dasharray: 40 139;
        }
        &__bottom {
            stroke-dasharray: 40 180;
        }
        .line {
            fill:none;
            transition: stroke-dasharray 400ms, stroke-dashoffset 400ms;
            stroke:#000;
            stroke-width:5.5;
            stroke-linecap:round;
        }
        &.active .svg-icon__top {
            stroke-dashoffset: -98px;
        }
        &.active .svg-icon__bottom {
            stroke-dashoffset: -138px;
        }
    }
</style>