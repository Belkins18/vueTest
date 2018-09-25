<template>
    <transition name="fade">
        <div class="modal" :class="{[`${classes}`]: classes}" tabindex="-1" role="dialog" v-if="isVisible">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"> {{title}} </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                                @click.prevent="onClose()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div v-if="this.$slots['modal-body']" class="modal-body">
                        <slot name="modal-body"></slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="modal-footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
            };
        },
        props: {
            classes: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            isVisible: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onClose() {
                this.$emit('close');
            }
        }
    };
</script>

<style scoped lang="scss">
    .modal {
        background: rgba(0, 0, 0, 0.6);
        display: block;
    }

    @media screen and (orientation: portrait) {
        .modal {
            .modal-body {
                max-height: 70vh;
                overflow: auto;
            }
        }
    }

    @media screen and (orientation: landscape) {
        .modal {
            .modal-body {
                max-height: 50vh;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }

    @media (min-width: map-get($grid-breakpoints, "sm")) {
        .modal-dialog {
            // FIXME: Родителю нужно задать position: relative;
            position: absolute;
            width: $modal-md;
            margin: 0;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
</style>