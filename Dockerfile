FROM postgis/postgis:14-3.3

# Install build packages we want
RUN apt-get update && apt-get install -y \
  wget \
  gdal-bin \
  && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /opt

# Download imposm binary
RUN wget --output-document=imposm.tar.gz \
    https://github.com/omniscale/imposm3/releases/download/v0.11.1/imposm-0.11.1-linux-x86-64.tar.gz \
    && tar -xzf imposm.tar.gz \
    && ln -s imposm-0.11.1-linux-x86-64/imposm ./imposm \
    && rm -f imposm.tar.gz

COPY initdb-postgis.sh /docker-entrypoint-initdb.d/20_ext_postgis.sh