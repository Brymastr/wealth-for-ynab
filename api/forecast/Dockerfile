FROM lambci/lambda:build-python3.8 as build

ENV VIRTUAL_ENV=venv
ENV PATH $VIRTUAL_ENV/bin:$PATH
RUN python3 -m venv $VIRTUAL_ENV

RUN pip install --upgrade pip

RUN pip install numpy pandas convertdate lunarcalendar holidays
RUN pip install pystan==2.19.1.1
RUN pip install prophet


#  Copy built items to runtime image
FROM amazon/aws-lambda-python:3.8 as runtime

WORKDIR /var/lang/lib/python3.8/site-packages
COPY --from=build /var/task/venv/lib/python3.8/site-packages/ ./

WORKDIR /app
COPY app/*.py ./
COPY .lambdaignore ./

CMD [ "/app/main.handler" ]
