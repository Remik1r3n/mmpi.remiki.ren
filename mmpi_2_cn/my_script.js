// 全局状态变量（使用 let/const 替代隐式声明以防止污染）
const DEBUG_MODE = false;
let longform = true;  // All questions or first 370
let gender = 0;       // 0==male, 1==female
let ans = [];         // Answers to questions: [T,F,?]

// 追加文本到 body 末尾
function append_text(txt) {
  const p = document.createElement("p");
  p.style.margin = "0 auto";
  p.style.color = "#FFFFFF";
  p.textContent = txt;
  
  document.body.append(p, document.createElement("br"));
}

// 向表格行追加单元格
function append_td(row, txt) {
  const td = document.createElement("td");
  td.textContent = txt;
  row.appendChild(td);
}

// 向表格追加行（支持传入无限个参数作为列数据）
function append_tr(table, ...cellData) {
  const tr = document.createElement("tr");
  cellData.forEach(data => append_td(tr, data));
  table.appendChild(tr);
}

// 生成表格的基础结构并返回 tbody 引用
function make_table(...headers) {
  const table = document.createElement("table");
  table.border = "3";
  table.style.margin = "auto";
  table.setAttribute("bgcolor", "#B0C4DE");

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.append(thead, tbody);
  document.body.appendChild(table);

  // 生成表头
  const tr = document.createElement("tr");
  headers.forEach(header => append_td(tr, header));
  thead.appendChild(tr);

  return tbody;
}

// 一键清除所有的表格、图片、段落和换行
function clearTablesAndGraphics() {
  document.querySelectorAll('table, img, p, br').forEach(el => el.remove());
}

// 清除包含“临床量表”关键词之后的所有 P 和 H3 元素，并清除所有表格与图片
function clearContent() {
  // 先干掉表格和图片
  document.querySelectorAll('table, img').forEach(el => el.remove());

  // 封装内部小函数：定位到关键字并删除其后的同类节点
  const removeElementsAfterKeyword = (selector, keyword) => {
    const elements = document.querySelectorAll(selector);
    let lastIndex = -1;
    
    // 找到最后一个包含关键字的元素索引
    elements.forEach((el, index) => {
      if (el.textContent.includes(keyword)) lastIndex = index;
    });
    
    // 删除该索引之后的所有同类元素
    if (lastIndex !== -1) {
      for (let i = lastIndex + 1; i < elements.length; i++) {
        elements[i].remove();
      }
    }
  };

  removeElementsAfterKeyword('p', '临床量表');
  removeElementsAfterKeyword('h3', '临床量表');
}

// 生成指定长度的随机数组 (范围: 30 ~ 80)
function generateRandomArray(arrayLength) {
  return Array.from({ length: arrayLength }, () => Math.floor(Math.random() * 51) + 30);
}

// 渲染所有问题
function my_doc_write_all_questions() {
  for (let i = 1; i <= 370; i++) {
    // questions 和 questions_zh 在外部定义
    my_doc_write_question(`Q${i}`, `${i}. ${questions[i]}`, questions_zh[i]);
    
    // 原有逻辑：在第370题时开启一个 div 容器
    if (i === 370) {
      document.write('<div id="longformdiv">');
    }
  }
  
  // 原有逻辑：循环结束后闭合 div
  document.write('</div>');

  if (DEBUG_MODE) {
    // removeRequired 在别处定义
    if (typeof removeRequired === 'function') removeRequired();
  }
}

// 渲染单道问题（使用模板字符串）
function my_doc_write_question(name, text, text_zh) {
  const htmlString = `
    <div class="question-item">
      <div class="question-text-en">${text}</div>
      <div class="question-text-zh">${text_zh}</div>
      <div class="options-wrapper">
        
        <label class="option-label" for="${name}">
          <input type="radio" id="${name}" name="${name}" value="T" required="required">
          <span>是</span>
        </label>
        
        <label class="option-label" for="Not_${name}">
          <input type="radio" id="Not_${name}" name="${name}" value="F" required="required">
          <span>否</span>
        </label>
        
      </div>
    </div>
  `;
  document.write(htmlString);
}

// 选中表单中所有的单选框
function selectAll() {
  const form = document.getElementById("select_all");
  if (!form) return;
  
  // 直接遍历修改 checked 状态
  form.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = true;
  });
}