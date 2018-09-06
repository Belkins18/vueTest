<template>
    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <slot name="modal-header">
                            Modal title
                        </slot>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="$emit('close')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <slot name="modal-body">
                        Modal body
                    </slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"
                            @click.prevent="$emit('close')">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible: false
            };
        },
    };
</script>

<style scoped lang="scss">
    .modal {
        background: rgba(0, 0, 0, 0.6);
        display: block;
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