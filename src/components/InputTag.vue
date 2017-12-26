<script>
/*eslint-disable*/
const validators = {
  email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
  url : new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
  text : new RegExp(/^[a-zA-Z]+$/),
  digits : new RegExp(/^[\d() \.\:\-\+#]+$/),
  isodate : new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
}
/*eslint-enable*/

export default {
  name: 'InputTag',

  props: {
    value: {
      default: null
    },
    tags: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    onChange: {
      type: Function
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String,
      default: ''
    }
  },
  watch: {
    inputValue() {
      
    }
  },
  data () {
    return {
      newTag: '',
      isFocused: false,
      inputValue: ''
    }
  },
  computed: {
    classes() {
      return {
        'input-focused': this.isFocused,
        'input-has-value': Boolean(this.inpVal) || this.inputValue,
        'read-only': this.readOnly
      }
    }
  },
  methods: {
    focusNewTag () {
      if (this.readOnly) { return }
      this.$el.querySelector('.new-tag').focus()
    },

    addNew (tag) {
      if (tag && this.tags.indexOf(tag) === -1 && this.validateIfNeeded(tag)) {
        this.tags.push(tag)
        this.tagChange()
      }
      this.newTag = ''
    },

    validateIfNeeded (tagValue) {
      if (this.validate === '' || this.validate === undefined) {
        return true
      } else if (Object.keys(validators).indexOf(this.validate) > -1) {
        return validators[this.validate].test(tagValue)
      }
      return true
    },

    remove (index) {
      this.tags.splice(index, 1)
      this.tagChange()
      if(this.tags.length == 0)
        this.inputValue = null      
    },

    removeLastTag () {
      if (this.newTag) { return }
      this.tags.pop()
      this.tagChange()
    },

    tagChange () {
      if (this.onChange) {
        // avoid passing the observer
        this.onChange(JSON.parse(JSON.stringify(this.tags)))
      }
    },
    blur(e) {
      this.$nextTick(() => (this.isFocused = false))
      this.$emit('blur', e)
    },
    focus(e) {
      this.isFocused = true
      this.$refs.input.focus()
      this.$emit('focus', e)
    },
    onInput(e) {
      
      this.inputValue = e.target.value
    }
  }
}
</script>

<template>

  <div @click="focusNewTag()" 
    :class="classes" 
    class="vue-input-tag-wrapper">
    <label for=""><slot></slot></label>
    <span v-for="(tag, index) in tags" v-bind:key="index" class="input-tag">
      <span>{{ tag }}</span>
      <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
    </span>
    <input v-if="!readOnly"
      ref="input"
      @input="onInput($event)"
      @focus="focus()"
      @blur="blur()"
      :placeholder="placeholder" 
      type="text" 
      v-model="newTag" 
      v-on:keydown.delete.stop="removeLastTag()" 
      v-on:keydown.enter.188.tab.prevent.stop="addNew(newTag)" 
      class="new-tag"/>
  </div>

</template>

<style lang="stylus" scoped>
$chipColor = #29b6f6

.vue-input-tag-wrapper {
  position relative;
  background-color: #fff;
  box-shadow: 0 0 0 1px #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem;
  padding: .625rem;
  line-height: 1.5;
  cursor: text;
  text-align: left;
  height: 60px;

  label {
    font-size: 0.85rem
    font-weight: normal
    position: absolute
    top: 0
    margin-top: 0.7rem
    padding: 0
    z-index: 1
    user-select: none
    transform: translateY(3px)
    pointer-events: none
    overflow: hidden
    transition-property: color, padding
    transition: 0.2s ease-out
  }
}

.vue-input-tag-wrapper .input-tag {
  background-color: $chipColor;
  border-radius: 2px;
  box-shadow: 0 0 0 1px #d9d9d9;
  color: #fff;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  padding: .25rem;
  margin-right: 4px;
}

.vue-input-tag-wrapper.input-focused, .vue-input-tag-wrapper.input-has-value
	label
		margin: 0
		color: #757575
	.new-tag
    margin-top: 1rem
  .input-tag
    margin-top: 1rem

.vue-input-tag-wrapper .input-tag .remove {
  cursor: pointer;
  font-weight: bold;
  color: #455a64;
}

.vue-input-tag-wrapper .input-tag .remove:hover {
  text-decoration: none;
}

.vue-input-tag-wrapper .input-tag .remove::before {
  content: " x";
}

.vue-input-tag-wrapper .new-tag {
  background: transparent;
  border: 0;
  color: #37474f;
  font-weight: 400;
  font-size: 1rem;
  margin: 6px;
  margin-left: 0;
  outline: none;
  padding-left: 0;
  width: 80px;
}

.vue-input-tag-wrapper.read-only {
  cursor: default;
}

</style>
