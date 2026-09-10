const parseRecord = (input) => {
  if (typeof input !== 'string') return null;
  const parts = input.split(/[,，]/);
  if (parts.length !== 2) return null;
  const name = parts[0].trim();
  const score = Number(parts[1].trim());
  if (!name || isNaN(score)) return null;
  return { name, score };
};

const parseBatch = (input) => {
  if (typeof input !== 'string') return [];
  return input
    .split(/[\n;；]/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const rec = parseRecord(line);
      if (!rec) console.warn('输入格式错误，已跳过：', line);
      return rec;
    })
    .filter(rec => rec !== null);
};

const collectRecords = () => {
  const list = [];
  while (true) {
    const input = prompt('请输入 姓名,成绩（如：李四,92），多条用换行或分号分隔，取消结束');
    if (input === null) break;
    const recs = parseBatch(input);
    list.push(...recs);
  }
  return list;
};

const cleanRecords = (list) => list.filter(r => r.score >= 0 && r.score <= 100);

const summarize = (list) => {
  if (list.length === 0) return null;
  const total = list.reduce((sum, r) => sum + r.score, 0);
  const avg = (total / list.length).toFixed(2);
  const max = list.reduce((a, b) => a.score >= b.score ? a : b);
  const failedNames = list.filter(r => r.score < 60).map(r => r.name);
  return { count: list.length, avg, max, failedNames };
};

const render = (rawList, validList, stats) => {
  const out = document.getElementById('output');
  if (!stats) {
    out.innerHTML = '<p>没有有效成绩可统计</p>';
    return;
  }
  const items = validList.map(r => `<li>${r.name}：${r.score}分</li>`).join('');
  const dropped = rawList.length - validList.length;
  out.innerHTML = `
    <h2>统计结果</h2>
    <p>录入 ${rawList.length} 条，有效 ${stats.count} 条${dropped ? `（已过滤 ${dropped} 条非法）` : ''}</p>
    <p>平均分：${stats.avg}</p>
    <p>最高分：${stats.max.score}分（${stats.max.name}）</p>
    <p>不及格：${stats.failedNames.join('、') || '无'}</p>
    <h3>有效成绩清单</h3>
    <ul>${items}</ul>
  `;
};

const main = () => {
  try {
    const raw = collectRecords();
    const valid = cleanRecords(raw);
    const stats = summarize(valid);
    console.log('原始录入：', raw);
    console.log('合法成绩：', valid);
    console.log('统计：', stats);
    render(raw, valid, stats);
  } catch (err) {
    console.error('运行出错：', err.message);
    document.getElementById('output').innerHTML = '<p>程序出错：' + err.message + '</p>';
  }
};

document.getElementById('start').addEventListener('click', main);
