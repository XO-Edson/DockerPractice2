FROM python:3.12-slim

WORKDIR /usr/src/app

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY requirements.txt .

RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt

COPY . .

RUN chown -R :appgroup /usr/src/app && chmod -R 750 /usr/src/app

USER appuser

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]