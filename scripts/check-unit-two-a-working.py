"""Supplementary numeric-equation audit; symbolic and conceptual work is separately reviewed."""
import json,re,ast,operator
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
u=json.loads((ROOT / 'src/content/ap-statistics/units/2-a.json').read_text())
ops={ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv,ast.Pow:operator.pow}
def calc(s):
 s=s.strip().rstrip('.').replace('−','-').replace('×','*').replace('÷','/').replace('²','**2').replace('³','**3')
 s=re.sub(r'(\d|\))\s*\(',r'\1*(',s)
 def rec(n):
  if isinstance(n,ast.Expression):return rec(n.body)
  if isinstance(n,ast.Constant) and isinstance(n.value,(int,float)):return n.value
  if isinstance(n,ast.BinOp) and type(n.op) in ops:return ops[type(n.op)](rec(n.left),rec(n.right))
  if isinstance(n,ast.UnaryOp) and isinstance(n.op,ast.USub):return -rec(n.operand)
  raise ValueError(s)
 return rec(ast.parse(s,mode='eval'))
checked=[];bad=[]
for q in u['questions']:
 for step in q['solution']['steps']+[q['solution']['warning']]:
  if not isinstance(step,str):continue
  s=re.sub(r'<[^>]*>',' ',step)
  s=re.sub(r'(?<=\d),(?=\d{3})','',s)
  # Only explicitly numeric equations; symbolic/TeX work is separately reviewed.
  pattern=r'(?<![\w.])((?:\d|\.)[\d.\s()+*/−×÷²³-]*?)\s*(=|≈)\s*(\d[\d.\s()+*/−×÷²³-]*)'
  for m in re.finditer(pattern,s):
   lhs,sign,rhs=m.groups()
   try:a,b=calc(lhs),calc(rhs)
   except (ValueError,SyntaxError,ZeroDivisionError):continue
   tol=(.5*10**(-len(rhs.strip().rstrip('.').split('.')[1])) if '.' in rhs.strip().rstrip('.') and '/' not in rhs else 1e-10)
   checked.append((q['id'],lhs.strip(),rhs))
   if abs(a-b)>tol+1e-10:bad.append((q['id'],lhs,rhs,a,b))
print(f'Checked {len(checked)} numeric equations across {len(set(x[0] for x in checked))} explanations.')
print('Mismatches:',bad)
assert not bad
