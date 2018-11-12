<template>
    <div class="evaluation">
        <p class="eval-title">Does this Custom-Service help you solve the problem?</p>
        <div class="eval-img">
            <span>
                <img src="~assets/img/faq/ic_happy_sl_green.png"> NO
            </span>
            <span>
                <img src="~assets/img/faq/ic_disappoint_def_g.png"> YES
            </span>
        </div>
        <div class="gave-star">
            <p>Please evaluate for us? THX.</p>
            <!-- <img src="~assets/img/faq/ic_favoritez_blue_evl.png" alt=""> -->
            <img v-for="(item,index) in 5" :key="index" src="~assets/img/faq/ic_favorite_def_evl.png" @click="starToBlue(index,$event)">
            <!-- <img v-for ="(item,index) in 5" :key="index" src="~assets/img/faq/ic_favoritez_blue_evl.png" @click="starToBlue(index,$event)"> -->
        </div>
    </div>
</template>