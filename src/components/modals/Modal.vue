<template>
    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form @submit.prevent="onSubmit()">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            {{modalStatus}}
                            <slot name="modal-header"></slot>
                        </h5>
                        <!-- FIXME: onSubmit => onClose -->
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                                @click.prevent="close()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div v-if="hasContent" class="modal-body">
                        <slot name="modal-body">
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="modal-btn"></slot>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false,
            };
        },
        props: {
            modalStatus: String,
            hasContent: Boolean
        },
        methods: {
            onSubmit() {
                this.$emit('validate');
            },
            close() {
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
                overflow: auto;
            }
        }
    }

    @media (min-width: map-get($grid-breakpoints, "sm")) {
        .modal-dialog {
            position: absolute;
            width: $modal-md;
            margin: 0;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
</style>