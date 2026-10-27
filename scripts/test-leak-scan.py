"""Regression checks for publication scanning, using synthetic text only."""
import importlib.util
import json
import subprocess
import tempfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('leak_scan',Path(__file__).with_name('leak-scan.py'))
scan=importlib.util.module_from_spec(spec);spec.loader.exec_module(scan)
text='alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima mike november oscar papa'
w=text.split();shingles={' '.join(w[i:i+scan.N]):'synthetic#1' for i in range(len(w)-scan.N+1)}
assert max(n for n,_,_ in scan.runs(text,shingles))==16
separate=json.dumps({'choices':[' '.join(w[:8]),' '.join(w[8:])]})
assert not any(n>=scan.FAIL_AT for _,t in scan.fragments('questions.json',separate) for n,_,_ in scan.runs(t,shingles))
single=json.dumps({'scenario':text})
assert any(n>=scan.FAIL_AT for _,t in scan.fragments('questions.json',single) for n,_,_ in scan.runs(t,shingles))
with tempfile.TemporaryDirectory() as tmp:
 root=Path(tmp);subprocess.run(['git','init','-q',tmp],check=True)
 (root/'new-question.txt').write_text(text)
 prior=scan.ROOT;scan.ROOT=root
 try:assert any(name=='new-question.txt' for name,_ in scan.blobs(False))
 finally:scan.ROOT=prior
print('Verified: untracked files included, separate JSON choices isolated, real within-field copied runs detected.')
