<template>
  <div id="index-app">
    <a-layout>
      <a-layout-header class="index-header">
        <div class="input-bar">
          <a-row>
            <a-col :md="4" :lg="2">{{ $ui.get('indexPatternLabel') }}</a-col>
            <a-col :md="20" :lg="22"><a-input v-model="pattern" :placeholder="$ui.get('indexPatternPlaceholder')"></a-input></a-col>
            <a-col></a-col>
          </a-row>
          <a-row>
            <a-col :md="4" :lg="2">{{ $ui.get('indexFlagesLabel') }}</a-col>
            <a-col :md="20" :lg="22">
              <a-checkbox-group v-model="flags" class="checkbox-group">
                <a-row>
                  <a-col :span="8">
                    <a-tooltip :title="$ui.get('rulesFlagsGTip')">
                      <a-checkbox value="g">g</a-checkbox>
                    </a-tooltip>
                  </a-col>
                  <a-col :span="8">
                    <a-tooltip :title="$ui.get('rulesFlagsITip')">
                      <a-checkbox value="i">i</a-checkbox>
                    </a-tooltip>
                  </a-col>
                  <a-col :span="8">
                    <a-tooltip :title="$ui.get('rulesFlagsUTip')">
                      <a-checkbox value="u">u</a-checkbox>
                    </a-tooltip>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="4" :lg="2">{{ $ui.get('indexReplacementLabel') }}</a-col>
            <a-col :md="20" :lg="22"><a-input v-model="replacement" :placeholder="$ui.get('indexReplacementPlaceholder')"></a-input></a-col>
          </a-row>
          <a-row>
            <a-col :md="4" :lg="2">
              <template v-if="hadResult"> {{ selectedRowKeys.length }}/{{ curData.length }} </template>
            </a-col>
            <a-col :md="4" :lg="2">
              <a-button type="primary" @click="onPreview">{{ $ui.get('indexBtnPreview') }}</a-button>
            </a-col>
            <a-col :md="4" :lg="2">
              <a-button type="danger" :disabled="!hadSelected" @click="onEffect">{{ $ui.get('indexBtnEffect') }}</a-button>
            </a-col>
          </a-row>
        </div>
      </a-layout-header>
      <a-layout-content>
        <a-table
          :columns="colulmns"
          :data-source="curData"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        ></a-table>
      </a-layout-content>
      <a-layout-footer class="index-footer">
        <a target="_blank" :href="$ui.get('indexRegexUrl')">{{ $ui.get('indexLearnRegex') }}</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
const undoKey = 'index-undo-key';

export default {
  data() {
    return {
      pattern: '',
      flags: [],
      replacement: '',
      colulmns: [
        {
          dataIndex: 'name',
          key: 'name',
          title: this.$ui.get('indexName'),
        },
        {
          dataIndex: 'source',
          key: 'source',
          title: this.$ui.get('indexSource'),
        },
        {
          dataIndex: 'result',
          key: 'result',
          title: this.$ui.get('indexResult'),
        },
      ],
      curData: [],
      oldData: [],
      selectedRowKeys: [],
    };
  },
  computed: {
    hadResult() {
      return this.curData.length > 0;
    },
    hadSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    onPreview() {
      if (this.pattern) {
        chrome.bookmarks.getTree(arr => {
          if (!chrome.runtime.lastError && arr && arr.length > 0) {
            const treeData = arr[0].children;

            this.selectedRowKeys = [];
            this.curData = [];
            this.arrayHandler(treeData);
          } else {
            this.selectedRowKeys = [];
            this.curData = [];
          }
        });
      } else {
        this.selectedRowKeys = [];
        this.curData = [];
      }
    },
    onEffect() {
      if (this.selectedRowKeys.length > 0) {
        const { curData } = this;
        this.oldData = [];

        this.selectedRowKeys.forEach(value => {
          for (const ele of curData) {
            if (ele.key === value) {
              chrome.bookmarks.update(
                value,
                {
                  url: ele.result,
                },
                res => {
                  if (!res) {
                    this.$message.error(this.$ui.get('indexErrorUpdateText'), 2);
                    console.error(ele);
                  } else {
                    this.oldData.push({
                      key: value,
                      source: ele.source,
                    });
                  }
                }
              );
              break;
            }
          }
        });
        this.onPreview();

        this.$notification.close(undoKey);
        setTimeout(() => {
          this.$notification.success({
            key: undoKey,
            placement: 'bottomRight',
            duration: 10,
            message: h => {
              return h('div', [
                this.$ui.get('indexCompletionText'),
                h('a', {
                  class: 'undo',
                  domProps: {
                    textContent: this.$ui.get('indexUndoText'),
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                      this.onUndo();
                    },
                  },
                }),
              ]);
            },
          });
        }, 0);
      }
    },
    onUndo() {
      const { oldData } = this;
      const len = oldData.length;
      oldData.forEach((item, index) => {
        chrome.bookmarks.update(
          item.key,
          {
            url: item.source,
          },
          res => {
            if (!res) {
              this.$message.error(this.$ui.get('indexErrorUpdateText'));
              console.error(item);
            }

            if (index === len - 1) {
              this.$notification.close(undoKey);
              this.onPreview();
            }
          }
        );
      });
    },
    arrayHandler(arr) {
      if (arr) {
        const { pattern, flags, replacement } = this;
        arr.forEach(item => {
          if (item.children && item.children.length > 0) {
            this.arrayHandler(item.children);
          } else {
            const { id, title, url } = item;
            if (this.$ui.regTest(pattern, flags, url)) {
              this.curData.push({
                key: id,
                name: title,
                source: url,
                result: this.$ui.regReplace(pattern, flags, url, replacement),
              });
            }
          }
        });
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>

<style lang="less">
.index-header {
  width: 100%;
  height: auto;
  background: #f0fcfc;
  .checkbox-group {
    width: 100%;
  }
}
.index-footer {
  text-align: center;
  background: #dfdfdf;
}
.undo {
  margin-left: 15px;
}
</style>
