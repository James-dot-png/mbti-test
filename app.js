// 题库配置
const questionSets = {
  simple: Array(20).fill().map((_,i) => ({
    question: `问题${i+1}：你通常更倾向于？`,
    options: i%2 === 0 ? 
      ['倾向社交互动', '选择独立思考'] : 
      ['重视实际成效', '关注潜在可能'],
    dimension: ['E','I','S','N','T','F','J','P'][i%4*2 + Math.floor(i/10)]
  })),
  
  medium: Array(40).fill().map((_,i) => ({
    question: `进阶问题${i+1}：在以下场景中你会？`,
    options: ['倾向社交互动', '选择独立思考'],
    dimension: ['E','I','S','N','T','F','J','P'][i%8]
  })),
  
  advanced: Array(60).fill().map((_,i) => ({
    question: `深度问题${i+1}：长期来看你更重视？`,
    options: ['实际成效', '潜在可能'],
    dimension: ['E','I','S','N','T','F','J','P'][(i%4)*2]
  })),
  
  // 初始化状态
  currentSet: [],
  currentQuestion: 0,
  scores: { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 },

  // 难度选择
  selectDifficulty(level) {
    this.currentSet = this[level];
    document.getElementById('difficulty-selection').classList.add('hidden');
    document.getElementById('question-container').classList.remove('hidden');
    this.showQuestion(0);
  },

  // 显示题目

  // 选项选择
  selectOption(optionIndex) {
    const dimension = document.querySelectorAll('.option-btn')[optionIndex].dataset.dimension;
    this.scores[dimension]++;
    
    if (this.currentQuestion < this.currentSet.length - 1) {
      this.currentQuestion++;
      this.showQuestion(this.currentQuestion);
    } else {
      this.showResult();
    }
  },

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
    this.showQuestion(this.currentQuestion);
  },

  showQuestion(index) {
    try {
      const q = this.currentSet[index];
      document.getElementById('question-text').textContent = q.question;
      const options = document.querySelectorAll('.option-btn');
      options.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.dataset.dimension = q.dimension;
        btn.disabled = false;
      });

      const progress = ((index + 1) / this.currentSet.length * 100).toFixed(1);
      document.getElementById('progress').style.width = `${progress}%`;
      document.getElementById('progress').style.backgroundColor = 
        progress >= 80 ? '#73d13d' : progress >= 50 ? '#ffec3d' : '#40a9ff';

      // 显示/隐藏上一题按钮
      document.querySelector('.prev-btn').style.display = 
        index > 0 ? 'block' : 'none';
    } catch (error) {
      console.error('显示题目时出错:', error);
      this.showResult();
    }
  },
  // 显示结果
  showResult() {
    const type = this.calculateType();
    const desc = this.getTypeDescription(type);
    
    document.getElementById('mbti-type').textContent = type;
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('question-container').style.display = 'none';
  },

  // 计算MBTI类型
  calculateType() {
    return ['E','I','S','N','T','F','J','P']
      .filter((_,i) => i%2 === 0)
      .map(d => this.scores[d] > this.scores[String.fromCharCode(d.charCodeAt(0)+1)] ? d : String.fromCharCode(d.charCodeAt(0)+1))
      .join('');
  },

  // 扩展类型描述
  getTypeDescription(type) {
    const descriptions = {
      ISTJ: {
        tag: '务实负责的守护者',
        features: ['严谨务实', '注重细节', '遵守规则', '高度责任感'],
        careers: ['会计师', '审计师', '行政管理', '法律从业者'],
        representatives: ['沃伦·巴菲特', '英国女王伊丽莎白二世'],
        strengths: ['可靠高效', '执行力强', '善于组织'],
        weaknesses: ['过于保守', '缺乏灵活性']
      },
      ESTJ: {
        tag: '高效组织者',
        features: ['果断自信', '注重效率', '善于执行', '领导才能'],
        careers: ['项目经理', '军官', '企业管理者', '体育教练'],
        representatives: ['美国前总统林登·约翰逊', '法官朱迪'],
        strengths: ['决策迅速', '组织能力强', '目标明确'],
        weaknesses: ['缺乏同理心', '过于强硬']
      }
    };
    return descriptions[type] || {
      tag: '该类型分析正在完善中',
      features: [],
      careers: [],
      representatives: [],
      strengths: [],
      weaknesses: []
    };
  },

  // 类型描述库
  getTypeDescription(type) {
    const descriptions = {
      ISTJ: '务实负责的守护者，注重细节和秩序',
      ISFJ: '温暖奉献的保护者，善于关怀他人',
      INFJ: '富有远见的倡导者，追求深层意义',
      INTJ: '战略思考者，擅长系统化解决问题',
      ISTP: '灵活的问题解决者，擅长实际操作',
      ISFP: '敏感的艺术家，重视当下体验',
      INFP: '理想主义者，坚守内心价值观',
      INTP: '逻辑分析家，追求知识体系',
      ESTP: '机智的实践者，善于随机应变',
      ESFP: '热情表演者，带来欢乐氛围',
      ENFP: '充满激情的启发者，探索可能性',
      ENTP: '聪明创新者，挑战传统思维',
      ESTJ: '高效组织者，注重执行效率',
      ESFJ: '热心协调者，维系社会关系',
      ENFJ: '魅力领导者，激励他人成长',
      ENTJ: '果断战略家，擅长统筹规划'
    };
    return descriptions[type] || '该类型分析正在完善中';
  }
};

// 暴露方法给HTML调用
window.selectDifficulty = (level) => questionSets.selectDifficulty(level);
window.selectOption = (i) => questionSets.selectOption(i);
window.previousQuestion = (i) => questionSets.previousQuestion(i);
window.showQuestion = (i) => questionSets.showQuestion(i);
window.selectDifficulty = (level) => questionSets.selectDifficulty(level);
window.selectOption = (i) => questionSets.selectOption(i);
window.previousQuestion = (i) => questionSets.previousQuestion(i);
window.showDifficultySelection = () => {
  document.getElementById('difficulty-selection').classList.remove('hidden');
  document.getElementById('question-container').classList.add('hidden');
  document.getElementById('result-container').classList.add('hidden');
};
window.showDifficultySelection = (i) => questionSets.showDifficultySelection(i);
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = (i) => {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('result-container').style.display = 'block';
  document.getElementById('mbti-type').textContent = calculateType(i);
};

window.calculateType = (i) => {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  // 计算各维度得分逻辑
  return Object.entries(scores)
    .reduce((type, [dim, score]) => 
      score >= 0 ? type + dim[0] : type + dim[1], '');
};
window.showResult = () => questionSets.showResult();
window.calculateType = () => questionSets.calculateType();