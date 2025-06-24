.PHONY: all build docker clean \
        $(patsubst %,build-%,${COMPONENTS}) \
        $(patsubst %,docker-%,${COMPONENTS}) \
        $(patsubst %,clean-%,${COMPONENTS})

COMPONENTS := vote-manager server web

all: docker

build:
	@for svc in $(COMPONENTS); do \
		$(MAKE) -C $$svc build || exit 1; \
	done

docker:
	@for svc in $(COMPONENTS); do \
		$(MAKE) -C $$svc docker || exit 1; \
	done

clean:
	@for svc in $(COMPONENTS); do \
		$(MAKE) -C $$svc clean || exit 1; \
	done

###

build-%:
	$(MAKE) -C $* build

docker-%:
	$(MAKE) -C $* docker

clean-%:
	$(MAKE) -C $* clean
