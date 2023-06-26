<template>
    <transition name="modal">
        <div class="modal" v-if="toggle">
            <div class="modal-bg" @click="closeModal()" v-if="canClose == true">
            </div>
            <div class="modal-bg" v-if="canClose == false">
            </div>
            <div class="modal-container" :class="{fixedHeight: isFixedHeight}" ref="modalContainer" id="modalContainer">
                <div class="modal-close closeBtn" @click="closeModal()" v-if="canClose == true">
                    <el-icon class="el-icon-close" aria-hidden="true">
                        <Close />
                    </el-icon>
                </div>
                <div class="modal-tit" :style="tit=='選擇模式' || tit=='Choose Mode' && windowWidth < 768 ? 'display:none;' : 'display:block;'">
                    {{tit}}
                </div>
                <div class="modal-container-infoArea" :class="{'itemBlock type2 hasCorner1 hasCorner2': tit=='選擇模式' || tit=='Choose Mode'}">
                    <slot name="infoArea"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { computed } from 'vue';
import { useCommonStore } from '@/store';

export default {
    name: 'CommonModal',
    props: ["canClose", "tit"],
    data: function () {
        return { 
            toggle: !1, 
            isFixedHeight: !1 
        }
    },
    setup() {
        const store = useCommonStore();
        const windowWidth = computed(() => store.windowWidth);

        return {
            windowWidth
        }
    },
    methods: {
        closeModal: function () {
            this.toggle = !1
        }
    }
}
</script>