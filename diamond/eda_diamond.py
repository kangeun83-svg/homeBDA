#!/usr/bin/env python3
import os
from pathlib import Path
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import io

# 출력 경로
BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "images"
MD_PATH = BASE_DIR / "diamond_analysis.md"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# 데이터 로드
df = sns.load_dataset('diamonds')

# 유틸: DataFrame을 Markdown 표로 변환(예외처리 포함)
def df_to_md(df_obj):
    try:
        return df_obj.to_markdown()
    except Exception:
        # fallback: simple csv-like table
        return df_obj.to_csv(sep='|')

# Markdown 파일 작성 시작
with open(MD_PATH, 'w', encoding='utf-8') as md:
    md.write('# Seaborn `diamonds` 데이터 EDA\n')
    md.write('\n')

    # 기초 기술통계
    md.write('## 1. 기본 정보 및 기초 기술통계\n')
    md.write('\n')
    md.write('### 데이터 샘플\n')
    md.write('\n')
    md.write(df.head().to_markdown())
    md.write('\n\n')

    md.write('### 데이터 요약 (`info()` 및 기술통계)\n')
    md.write('\n')
    buf = io.StringIO()
    df.info(buf=buf)
    info_text = buf.getvalue()
    md.write("```\n")
    md.write(info_text)
    md.write("\n```\n")

    md.write('\n')
    md.write('### 수치형 기술통계 (`describe`)\n')
    md.write('\n')
    md.write(df.describe().to_markdown())
    md.write('\n\n')

    md.write('### 범주형 통계 (value counts)\n')
    md.write('\n')
    for col in ['cut','color','clarity']:
        md.write(f'#### `{col}` 분포\n')
        md.write('\n')
        md.write(df[col].value_counts().to_markdown())
        md.write('\n\n')

    # 1) 히스토그램: price
    plt.figure(figsize=(8,5))
    sns.histplot(df['price'], bins=50, kde=True)
    plt.title('가격 히스토그램')
    hist_path = IMAGES_DIR / 'hist_price.png'
    plt.savefig(hist_path, bbox_inches='tight')
    plt.close()

    md.write('## 2. Price 분포 (히스토그램)\n')
    md.write('\n')
    md.write(f'![가격 히스토그램](images/{hist_path.name})\n')
    md.write('\n')

    # 히스토그램 관련 피벗: cut별 가격 통계
    pivot_price_by_cut = df.pivot_table(index='cut', values='price', aggfunc=['count','mean','median','std'])
    pivot_price_by_cut.columns = ['_'.join(map(str,c)).strip() for c in pivot_price_by_cut.columns]
    md.write('#### Cut별 Price 요약 (count / mean / median / std)\n')
    md.write('\n')
    md.write(pivot_price_by_cut.to_markdown())
    md.write('\n\n')

    # 2) 산점도: carat vs price colored by cut
    plt.figure(figsize=(8,6))
    sns.scatterplot(data=df.sample(3000, random_state=1), x='carat', y='price', hue='cut', alpha=0.6)
    plt.title('캐럿과 가격 산점도 (샘플)')
    scatter_path = IMAGES_DIR / 'scatter_carat_price.png'
    plt.savefig(scatter_path, bbox_inches='tight')
    plt.close()

    md.write('## 3. Carat vs Price 산점도\n')
    md.write('\n')
    md.write(f'![캐럿과 가격 산점도](images/{scatter_path.name})\n')
    md.write('\n')

    # 산점도 관련 피벗: carat 범주별(6구간) & cut별 평균 price
    df['carat_bin'] = pd.cut(df['carat'], bins=6)
    pivot_carat_cut = df.pivot_table(index='carat_bin', columns='cut', values='price', aggfunc='mean')
    md.write('#### Carat 구간별 & Cut별 평균 Price\n')
    md.write('\n')
    md.write(df_to_md(pivot_carat_cut))
    md.write('\n\n')

    # 3) Boxplot: price by cut
    plt.figure(figsize=(8,6))
    sns.boxplot(data=df, x='cut', y='price', order=['Fair','Good','Very Good','Premium','Ideal'])
    plt.yscale('log')
    plt.title('컷별 가격 분포 (로그 스케일)')
    box_path = IMAGES_DIR / 'box_price_cut.png'
    plt.savefig(box_path, bbox_inches='tight')
    plt.close()

    md.write('## 4. Cut별 Price 분포 (Boxplot)\n')
    md.write('\n')
    md.write(f'![컷별 가격 분포 (박스플롯)](images/{box_path.name})\n')
    md.write('\n')

    # boxplot 관련 기술통계: groupby describe
    grp_price_cut = df.groupby('cut')['price'].describe()
    md.write('#### Cut별 Price 기술통계 (describe)\n')
    md.write('\n')
    md.write(grp_price_cut.to_markdown())
    md.write('\n\n')

    # 4) Countplot: cut
    plt.figure(figsize=(6,4))
    sns.countplot(data=df, x='cut', order=df['cut'].value_counts().index)
    plt.title('컷별 개수')
    cnt_path = IMAGES_DIR / 'count_cut.png'
    plt.savefig(cnt_path, bbox_inches='tight')
    plt.close()

    md.write('## 5. Cut 분포 (Countplot)\n')
    md.write('\n')
    md.write(f'![컷별 개수](images/{cnt_path.name})\n')
    md.write('\n')

    # countplot 관련 교차표: cut vs color
    crosstab_cut_color = pd.crosstab(df['cut'], df['color'])
    md.write('#### Cut vs Color 교차표 (count)\n')
    md.write('\n')
    md.write(crosstab_cut_color.to_markdown())
    md.write('\n\n')

    # 5) Heatmap: 상관관계
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    corr = df[numeric_cols].corr()
    plt.figure(figsize=(8,6))
    sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm')
    plt.title('수치형 변수 상관행렬')
    heat_path = IMAGES_DIR / 'corr_heatmap.png'
    plt.savefig(heat_path, bbox_inches='tight')
    plt.close()

    md.write('## 6. 수치형 변수 상관관계 (Heatmap)\n')
    md.write('\n')
    md.write(f'![수치형 변수 상관행렬 (히트맵)](images/{heat_path.name})\n')
    md.write('\n')

    md.write('#### 상관행렬 (수치 표)\n')
    md.write('\n')
    md.write(corr.to_markdown())
    md.write('\n\n')

    # 6) Violin: price by clarity
    plt.figure(figsize=(10,6))
    order_clarity = sorted(df['clarity'].unique(), key=lambda x: list('IFVVS1VVS2VS1VS2SI1SI2I1I2'.split()))
    # fallback ordering
    sns.violinplot(data=df, x='clarity', y='price', order=sorted(df['clarity'].unique()))
    plt.yscale('log')
    plt.title('클래러티별 가격 분포 (바이올린, 로그 스케일)')
    viol_path = IMAGES_DIR / 'violin_price_clarity.png'
    plt.savefig(viol_path, bbox_inches='tight')
    plt.close()

    md.write('## 7. Clarity별 Price 분포 (Violin)\n')
    md.write('\n')
    md.write(f'![클래러티별 가격 분포 (바이올린)](images/{viol_path.name})\n')
    md.write('\n')

    # violin 관련 피벗: clarity별 가격 통계
    pivot_price_clarity = df.pivot_table(index='clarity', values='price', aggfunc=['count','mean','median','std'])
    pivot_price_clarity.columns = ['_'.join(map(str,c)).strip() for c in pivot_price_clarity.columns]
    md.write('#### Clarity별 Price 요약\n')
    md.write('\n')
    md.write(pivot_price_clarity.to_markdown())
    md.write('\n\n')

    md.write('---\n')
    md.write('### 결론 요약\n')
    md.write('\n')
    md.write('- `price`는 오른쪽으로 치우친 분포를 보이며, `carat`과 `price`는 강한 양의 상관관계를 가짐.\n')
    md.write('- `cut`, `clarity`, `color`는 평균 가격에 차이를 보이며, `clarity` 및 `cut`이 가격에 큰 영향을 줌.\n')

print(f"생성된 마크다운: {MD_PATH}")
print(f"이미지 저장 위치: {IMAGES_DIR}")
