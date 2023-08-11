<template>
    <div>
        <div :class="{'selection-color' : isSelected, 'channelname': true, 'inline': true}" @click="handleChannelClicked">
            <p>{{ channel.name }}</p>
        </div>
        <div class="inline">
            <div v-if="isSelected" class="channel-options" @click="onSelectOption">
                <div v-if="optionSelected">
                    <div class="cross"></div>
                </div>
                <div v-else>
                    <div class="dot dot1"></div>
                    <div class="dot dot2"></div>
                    <div class="dot dot3"></div>
                </div>
            </div>
        </div>
        <div class="option-list" v-if="isSelected && optionSelected">
            <p class="options" @click="leaveChannel">Leave Channel</p>
            <div v-if="isUserOwner">
                <div v-if="channel.password && channel.password.length > 0"> <!--TODO changer condition pcq innacceptable d'avoir le password dans le programme du front-->
                    <p class="options" @click="setShowPasswordPopUp('change')">Change password</p>
                    <p class="options" @click="removePassword">Remove password</p>
                </div>
                <div v-else>
                    <p class="options" @click="setShowPasswordPopUp('set')">Set password</p>
                </div>
            </div>
        </div>
        <SetPassword ref="SetPassword" :show="showPasswordPopUp" :isChange="passwordPopUpType === 'change'" :isSet="passwordPopUpType === 'set'" @set-password="setPassword" @change-password="changePassword" @close="closePasswordPopUp"/>
        <div class="white-space"></div>
    </div>
</template>

<script>
import axios from 'axios';
import SetPassword from './SetPassword.vue';

export default {
    name: 'Channel-Component',
    components:
    {
        SetPassword,
    },
    props: 
    {
        channel: Object, 
        isSelected: Boolean,
        socket: null,
    },
    data()
    {
        return {
            showPasswordPopUp: false,
            optionSelected: false,
            isUserOwner: false,
            passwordPopUpType: '',
        }
    },
    methods: {
        onSelectOption() 
        {
            this.optionSelected = !this.optionSelected;
            this.$emit('get-is-user-owner', this.channel.channel_id);
        },
        setIsUserOwner(result)
        {
            this.isUserOwner = result;
        },
        handleChannelClicked()
        {
            this.$emit('channel-clicked', this.channel);
        },
        leaveChannel()
        {
            this.$emit('leave-channel', this.channel);
        },
        async changePassword(password)
        {
            try
            {
                await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/changePassword`, 
                {
                    channel: this.channel,
                    password: password,
                });
                this.$refs.SetPassword.goodRequest();
                this.$emit('update-channels');
            }
            catch (e)
            {
                console.log('le e :', e);
                if (e.response.data.message === 'Password not good length')
                    this.$refs.SetPassword.notGoodLength()
            }
        },
        
        async setPassword(password)
        {
            try
            {
                await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/setPassword`, 
                {
                    channel: this.channel,
                    password: password,
                });
                this.$refs.SetPassword.goodRequest();
                this.$emit('up-channels');
            }
            catch (e)
            {
                console.log('le e :', e);

                if (e.response.data.message === 'Password not good length')
                    this.$refs.SetPassword.notGoodLength()
            }
        },
        async removePassword()
        {
            try
            {
                const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/removePassword`, 
                {
                    channel: this.channel
                });
                console.log(res);
                this.$emit('update-channels');
            }
            catch (e)
            {
                console.error(e);
            }
        },
        setShowPasswordPopUp(content)
        {
            this.showPasswordPopUp = true;
            this.passwordPopUpType = content;
        },
        closePasswordPopUp()
        {
            this.showPasswordPopUp = false;
        }
    }
}
</script>

<style>
.channelname p
{
    cursor: pointer;
    margin: 0;
}

.inline
{
    display: inline-block;
}
.white-space
{
    margin-bottom: 1em;
}
.leave-channel
{
    cursor: pointer;
}

.channel-options
{
    position: relative;
    width: 1em;
    height: 1em;
    margin-left: 1em;
    border-radius: 50%;
    background-color: #BEBACE;
    border: 0.03em solid #fafafa ;
    cursor: pointer;
}

.dot
{
    position: absolute;
    top: 44%;
    left: 0%;
    background-color: #E9E6F9;
    width: 0.15em;
    height: 0.15em;
    border-radius: 50%;
}

.dot1
{
    transform: translate(+50%, -0%);
}
.dot2
{
    transform: translate(+262%, -0%);
}

.dot3
{
    transform: translate(+475%, -0%);
}

.cross 
{
    position: relative;
    width: 0.5em;
    height: 0.5em;
    left: 0.25em;
    top: 0.25em;
}

.cross::before,
.cross::after {
    content: "";
    position: absolute;
    background-color: #E9E6F9;
}

.cross::before {
  width: 100%;
  height: 0.1em;
  top: 50%;
  left: 0;
  transform: translateY(-50%) rotate(45deg);
}

.cross::after {
  width: 0.1em;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}
</style>